if not lib.checkDependency('qbx_core', '1.6.0') then error() end
if not lib.checkDependency('ox_lib', '3.0.0') then error() end
if not lib.checkDependency('ox_inventory', '2.20.0') then error() end

local config = require 'config'
local PRODUCTS = config.shopItems ---@type type<string, ShopItem>
local LOCATIONS = config.locations ---@type table<string, ShopLocation>

local ITEMS = exports.ox_inventory:Items()

local Vendors = {}
local Points = {}
local Blips = {}

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

---@param data { type: string, location: integer }
local function openShop(data)
	lib.print.debug("Opening shop: " .. data.type, "Location: " .. data.location)

	setShopVisible(true)

	local shopItems = lib.callback.await("EF-Shops:Server:OpenShop", false, data.type, data.location)

	if not shopItems then
		lib.print.error("Failed opening shop: " .. data.type)
		return
	end

	local shopData = LOCATIONS[data.type]

	for _, item in pairs(shopItems) do
		local productData = PRODUCTS[shopData.shopItems][item.name]

		item.label = ITEMS[item.name]?.label
		item.weight = ITEMS[item.name]?.weight
		item.category = productData.category
		item.type = productData.type
		item.imagePath = GetItemIcon(item.name)
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
	SendReactMessage("setCurrentShop", { id = data.type, location = data.location, label = config.locations[data.type].label })
	SendReactMessage("setShopItems", shopItems)
end

RegisterNuiCallback("purchaseItems", function(data, cb)
	local success = lib.callback.await("EF-Shops:Server:PurchaseItems", false, data)

	if not success then
		lib.notify({ title = "Purchase Failed", message = "An error occurred while trying to purchase items.", type = "error" })
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
	for shopID, storeData in pairs(config.locations) do
		if not storeData.model or not next(storeData.model) then
			lib.print.error("No model found for shop: " .. shopID)
			goto continue
		end

		for locationIndex, locationCoords in pairs(storeData.coords) do
			if not storeData.blip.disabled then
				local StoreBlip = AddBlipForCoord(locationCoords)
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

			local model = storeData.model[math.random(1, #storeData.model)]

			local targetOptions = {
				{
					name = storeData.label,
					label = storeData.targetLabel or "Browse Shop",
					icon = storeData.targetIcon or "fas fa-cash-register",
					items = storeData.requiredItem,
					groups = storeData.groups,
					onSelect = function()
						openShop({ type = shopID, location = locationIndex })
					end
				}
			}

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
					Vendors[shopID .. locationIndex] = CreateObject(model, locationCoords.x, locationCoords.y, locationCoords.z - 1.03, 0, 0, 0)
					SetEntityHeading(Vendors[shopID .. locationIndex], locationCoords.w)
					FreezeEntityPosition(Vendors[shopID .. locationIndex], true)
				end

				function deleteEntity()
					RemoveEntity(Vendors[shopID .. locationIndex])
				end
			end

			local point = lib.points.new(locationCoords, 25)
			function point:onEnter()
				if not Vendors[shopID .. locationIndex] or (Vendors[shopID .. locationIndex] and not DoesEntityExist(Vendors[shopID .. locationIndex])) then
					while not HasModelLoaded(model) do
						lib.requestModel(model)
					end
					createEntity()
				end

				exports.ox_target:addLocalEntity(Vendors[shopID .. locationIndex], targetOptions)
			end

			function point:onExit()
				deleteEntity()
			end

			Points[#Points + 1] = point
		end

		:: continue ::
	end
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
end)
