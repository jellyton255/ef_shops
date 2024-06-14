if not lib.checkDependency('qbx_core', '1.6.0') then error() end
if not lib.checkDependency('ox_lib', '3.0.0') then error() end
if not lib.checkDependency('ox_inventory', '2.20.0') then error() end

local PRODUCTS = require 'config.shop_items' ---@type table<string, table<string, ShopItem>>
local LOCATIONS = require 'config.locations' ---@type type<string, ShopLocation>

local ITEMS = exports.ox_inventory:Items()

local Vendors = {}
local Points = {}
local Blips = {}
local Targets = {}

ShopOpen = false

local scenarios = {
	"WORLD_HUMAN_VALET",
	"WORLD_HUMAN_AA_COFFEE",
	"WORLD_HUMAN_GUARD_STAND_CASINO",
	"WORLD_HUMAN_GUARD_PATROL",
	"PROP_HUMAN_STAND_IMPATIENT",
}

local function setShopVisible(shouldShow)
	ShopOpen = shouldShow

	SetNuiFocus(shouldShow, shouldShow)
	SendReactMessage("setVisible", shouldShow)
end

---@param data { type: string, location?: number }
local function openShop(data)
	if not data.location then data.location = 1 end

	lib.print.debug("Opening shop: " .. data.type, "Location: " .. data.location)

	local shopData = LOCATIONS[data.type]

	if not shopData then
		lib.print.error("Attempted to open a shop that does not exist: " .. data.type)
		return
	end

	if shopData.jobs then
		if (shopData.jobs[QBX.PlayerData.job.name] and shopData.jobs[QBX.PlayerData.job.name] <= QBX.PlayerData.job.grade.level) then
			goto continue
		else
			lib.notify({ title = "Shop Access", description = "You do not have access to this shop.", type = "error" })
			return
		end
	end

	:: continue ::

	setShopVisible(true)

	local shopItems = lib.callback.await("EF-Shops:Server:OpenShop", false, data.type, data.location)

	if not shopItems then
		lib.print.error("Failed opening shop: " .. data.type)
		setShopVisible(false)
		return
	end

	for _, item in pairs(shopItems) do
		local productData = PRODUCTS[shopData.shopItems][item.id]

		item.label = productData.metadata?.label or ITEMS[item.name]?.label
		item.weight = productData.metadata?.weight or ITEMS[item.name]?.weight
		item.category = productData.category
		item.imagePath = productData.metadata?.imageurl or GetItemIcon(item.name)
		item.jobs = productData.jobs
	end

	SendReactMessage("setSelfData", {
		weight = exports.ox_inventory:GetPlayerWeight(),
		maxWeight = exports.ox_inventory:GetPlayerMaxWeight(),
		money = {
			Cash = QBX.PlayerData.money.cash,
			Bank = QBX.PlayerData.money.bank
		},
		job = {
			name = QBX.PlayerData.job.name,
			grade = QBX.PlayerData.job.grade.level
		},
		licenses = QBX.PlayerData.metadata.licences
	})
	SendReactMessage("setCurrentShop", { id = data.type, location = data.location, label = LOCATIONS[data.type].label })
	SendReactMessage("setShopItems", shopItems)
end

exports("OpenShop", function(type)
	openShop({ type = type })
end)

RegisterNuiCallback("purchaseItems", function(data, cb)
	local success = lib.callback.await("EF-Shops:Server:PurchaseItems", false, data)

	if not success then
		lib.notify({ title = "Purchase Failed", description = "An error occurred while trying to purchase items.", type = "error" })
	end

	SendReactMessage("setSelfData", {
		weight = exports.ox_inventory:GetPlayerWeight(),
		maxWeight = exports.ox_inventory:GetPlayerMaxWeight(),
		money = {
			Cash = QBX.PlayerData.money.cash,
			Bank = QBX.PlayerData.money.bank
		},
		licenses = QBX.PlayerData.metadata.licences
	})

	cb(success)
end)

-- Frame Callbacks
RegisterNUICallback("Loaded", function(data, cb)
	cb(1)
	if not LocalPlayer.state.isLoggedIn then return end
end)

RegisterNUICallback("hideFrame", function(_, cb)
	cb(1)
	setShopVisible(false)
	Wait(400)
	SendReactMessage("setCurrentShop", null)
end)

CreateThread(function()
	for shopID, storeData in pairs(LOCATIONS) do
		if not storeData.coords then goto continue end

		for locationIndex, locationCoords in pairs(storeData.coords) do
			if not storeData.blip.disabled then
				local StoreBlip = AddBlipForCoord(locationCoords.x, locationCoords.y, locationCoords.z)
				SetBlipSprite(StoreBlip, storeData.blip.sprite)
				SetBlipScale(StoreBlip, storeData.blip.scale or 0.7)
				SetBlipDisplay(StoreBlip, 6)
				SetBlipColour(StoreBlip, storeData.blip.color)
				SetBlipAsShortRange(StoreBlip, true)

				local name = storeData.label

				AddTextEntry(name, name)
				BeginTextCommandSetBlipName(name)
				EndTextCommandSetBlipName(StoreBlip)

				Blips[#Blips + 1] = StoreBlip
			end

			local targetOptions = {
				{
					name = storeData.label,
					label = storeData.target?.label or "Browse Shop",
					icon = storeData.target?.icon or "fas fa-cash-register",
					items = storeData.requiredItem,
					onSelect = function()
						openShop({ type = shopID, location = locationIndex })
					end
				}
			}

			local model = type(storeData.model) == "table" and storeData.model[math.random(1, #storeData.model)] or storeData.model

			if model then -- Create entity target
				local createEntity
				local deleteEntity
				if IsModelAPed(model) then
					function createEntity()
						Vendors[shopID .. locationIndex] = CreatePed(0, model, locationCoords.x, locationCoords.y, locationCoords.z - 1.0, locationCoords.a, false, false)
						SetEntityInvincible(Vendors[shopID .. locationIndex], true)
						TaskStartScenarioInPlace(Vendors[shopID .. locationIndex], storeData.scenario or scenarios[math.random(1, #scenarios)], -1, true)
						SetBlockingOfNonTemporaryEvents(Vendors[shopID .. locationIndex], true)
						SetEntityNoCollisionEntity(Vendors[shopID .. locationIndex], cache.ped, false)
						FreezeEntityPosition(Vendors[shopID .. locationIndex], true)
					end

					function deleteEntity()
						DeletePed(Vendors[shopID .. locationIndex])
					end
				else
					function createEntity()
						Vendors[shopID .. locationIndex] = CreateObject(model, locationCoords.x, locationCoords.y, locationCoords.z - 1.03, false, false, false)
						SetEntityHeading(Vendors[shopID .. locationIndex], locationCoords.w)
						FreezeEntityPosition(Vendors[shopID .. locationIndex], true)
					end

					function deleteEntity()
						DeleteEntity(Vendors[shopID .. locationIndex])
					end
				end

				local point = lib.points.new(locationCoords, 25)
				function point:onEnter()
					if not Vendors[shopID .. locationIndex] or (Vendors[shopID .. locationIndex] and not DoesEntityExist(Vendors[shopID .. locationIndex])) then
						while not HasModelLoaded(model) do
							pcall(function()
								lib.requestModel(model)
							end)
						end
						createEntity()
					end

					exports.ox_target:addLocalEntity(Vendors[shopID .. locationIndex], targetOptions)
				end

				function point:onExit()
					deleteEntity()
				end

				Points[#Points + 1] = point
			else -- Create normal target point
				local target = exports.ox_target:addSphereZone({
					coords = locationCoords,
					options = targetOptions,
					radius = storeData.target?.radius
				})

				Targets[#Targets + 1] = target
			end
		end

		:: continue ::
	end
end)

-- Event handlers

RegisterNetEvent('QBCore:Client:OnMoneyChange', function()
	if not ShopOpen then return end
	SendReactMessage("setSelfData", {
		money = {
			Cash = QBX.PlayerData.money.cash,
			Bank = QBX.PlayerData.money.bank
		},
	})
end)

RegisterNetEvent('qbx_core:client:onSetMetaData', function(metadata)
	if not metadata == 'licenses' or not ShopOpen then return end
	SendReactMessage("setSelfData", {
		licenses = QBX.PlayerData.metadata.licences
	})
end)

RegisterNetEvent('qbx_core:client:onGroupUpdate', function()
	if not ShopOpen then return end
	Wait(5) -- Waiting for QBX to update job data
	SendReactMessage("setSelfData", {
		job = {
			name = QBX.PlayerData.job.name,
			grade = QBX.PlayerData.job.grade.level
		}
	})
end)

AddEventHandler('ox_inventory:updateInventory', function()
	if not ShopOpen then return end
	SendReactMessage("setSelfData", {
		weight = exports.ox_inventory:GetPlayerWeight(),
		maxWeight = exports.ox_inventory:GetPlayerMaxWeight()
	})
end)

AddEventHandler('onResourceStop', function(resource)
	if resource ~= GetCurrentResourceName() then return end

	for _, entity in pairs(Vendors) do
		if IsModelAPed(GetEntityModel(entity)) then
			DeletePed(entity)
		else
			DeleteObject(entity)
		end
	end

	for _, point in ipairs(Points) do
		point:remove()
	end

	for _, blip in ipairs(Blips) do
		RemoveBlip(blip)
	end

	for _, target in ipairs(Targets) do
		exports.ox_target:removeZone(target)
	end
end)
