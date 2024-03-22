lib.versionCheck('jellyton69/ef-shops')
if not lib.checkDependency('qbx_core', '1.6.0') then error() end
if not lib.checkDependency('ox_lib', '3.0.0') then error() end
if not lib.checkDependency('ox_inventory', '2.20.0') then error() end


local config = require 'config'
local TriggerEventHooks = require '@qbx_core.modules.hooks'

local ox_inventory = exports.ox_inventory
local ITEMS = ox_inventory:Items()

local PRODUCTS = config.shopItems
local LOCATIONS = config.locations

ShopData = {}

---@class ShopData
---@field name string
---@field location string
---@field inventory OxItem[]
---@field groups table

---@param shopType string
---@param shopData table
local function registerShop(shopType, shopData)
	ShopData[shopType] = {}
	for locationId, locationData in pairs(shopData.coords) do
		local shop = {
			name = shopData.name,
			location = locationId,
			inventory = lib.table.deepclone(shopData.inventory),
			groups = shopData.groups,
			coords = locationData
		}

		ShopData[shopType][locationId] = shop
	end
end

lib.callback.register("EF-Shops:Server:OpenShop", function(source, shop_type, location)
	local shop = ShopData[shop_type][location]
	return shop.inventory
end)

local mapBySubfield = function(tbl, subfield)
	local mapped = {}
	for i = 1, #tbl do
		local item = tbl[i]
		mapped[item[subfield]] = item
	end
	return mapped
end

lib.callback.register("EF-Shops:Server:PurchaseItems", function(source, purchaseData)
	local player = exports.qbx_core:GetPlayer(source)
	local shop = ShopData[purchaseData.shop.id][purchaseData.shop.location]

	if not shop then
		lib.print.error("Invalid shop: " .. purchaseData.shop.id .. " called by: " .. GetPlayerName(source))
		return false
	end

	local shopData = LOCATIONS[purchaseData.shop.id]
	local currency = purchaseData.currency
	local mappedCartItems = mapBySubfield(purchaseData.items, "name")
	local validCartItems = {} ---@type OxItem[]

	local totalPrice = 0
	for i = 1, #shop.inventory do
		local shopItem = shop.inventory[i]
		local itemData = ITEMS[shopItem.name]

		if mappedCartItems[shopItem.name] then
			if shopItem.license and player.PlayerData.metadata.licences[shopItem.license] ~= true then
				TriggerClientEvent('ox_lib:notify', source, { title = "You do not have the license to purchase this item (" .. shopItem.license .. ").", type = "error" })
				goto continue
			end

			if not exports.ox_inventory:CanCarryItem(source, shopItem.name, mappedCartItems[shopItem.name].quantity) then
				TriggerClientEvent('ox_lib:notify', source, { title = "You cannot carry the requested quantity of " .. itemData.label .. "s.", type = "error" })
				goto continue
			end

			if shopItem.count and (mappedCartItems[shopItem.name].quantity > shopItem.count) then
				TriggerClientEvent('ox_lib:notify', source, { title = "The requested amount of " .. itemData.label .. " is no longer in stock.", type = "error" })
				goto continue
			end

			local newIndex = #validCartItems + 1
			validCartItems[newIndex] = mappedCartItems[shopItem.name]
			validCartItems[newIndex].inventoryIndex = i

			totalPrice = totalPrice + (shopItem.price * mappedCartItems[shopItem.name].quantity)
		end

		:: continue ::
	end

	local itemStrings = {}
	for i = 1, #validCartItems do
		local item = validCartItems[i]
		local itemData = ITEMS[item.name]
		itemStrings[#itemStrings + 1] = item.quantity .. "x " .. itemData.label
	end
	local purchaseReason = table.concat(itemStrings, "; ")

	if currency == "cash" then
		if not player.Functions.RemoveMoney("cash", totalPrice, shopData.label .. ": " .. purchaseReason) and totalPrice > 0 then
			TriggerClientEvent('ox_lib:notify', source, { title = "You do not have enough cash for this transaction.", type = "error" })
			return false
		end
	else
		if not player.Functions.RemoveMoney("bank", totalPrice, shopData.label .. ": " .. purchaseReason) and totalPrice > 0 then
			TriggerClientEvent('ox_lib:notify', source, { title = "You do not have enough money in the bank for this transaction.", type = "error" })
			return false
		end
	end

	local dropItems = {}
	for i = 1, #validCartItems do
		local item = validCartItems[i]
		local itemData = ITEMS[item.name]
		local productData = PRODUCTS[shopData.shopItems][item.name]

		if not itemData then
			lib.print.error("Invalid item: " .. item.name .. " in shop: " .. shopType)
			goto continue
		end

		if not productData then
			lib.print.error("Invalid product: " .. item.name .. " in shop: " .. shopType)
			goto continue
		end

		local success, response = ox_inventory:AddItem(source, item.name, item.quantity)
		if success then
			if shop.inventory[item.inventoryIndex].count then
				shop.inventory[item.inventoryIndex].count = shop.inventory[item.inventoryIndex].count - item.quantity
			end

			TriggerEventHooks('itemPurchased', {
				source = source,
				shopId = purchaseData.shop.id,
				shopLocation = purchaseData.shop.location,
				items = response,
				product = shop.inventory[item.inventoryIndex],
				currency = currency,
			})
		else
			local itemPrice = item.quantity * shop.inventory[item.inventoryIndex].price
			if currency == "cash" then
				player.Functions.AddMoney("cash", itemPrice, "REFUND: " .. shopData.label .. ": " .. purchaseReason)
			else
				player.Functions.AddMoney("bank", itemPrice, "REFUND: " .. shopData.label .. ": " .. purchaseReason)
			end
		end

		:: continue ::
	end

	if #dropItems > 0 then
		exports.ox_inventory:CustomDrop('Shop Drop', dropItems, GetEntityCoords(GetPlayerPed(source)), #dropItems, 10000, GetPlayerRoutingBucket(source), `prop_cs_shopping_bag`)
	end

	return true
end)

local function shopFilter(filter, shop)
	for i = 1, #filter do
		local pattern = filter[i]

		if shop:match(pattern) then
			return true
		end
	end

	return false
end

local shopFilters = {
	"policeArmory",
	"ammunation",
	"hunting",
}

exports.ef_shops:registerHook('itemPurchased', function(payload)
	if not shopFilter(shopFilters, payload.shopId) then return end

	local source = payload.source
	local player = exports.qbx_core:GetPlayer(source)

	if not player then return end

	local owner = player.PlayerData.charinfo.firstname .. " " .. player.PlayerData.charinfo.lastname
	local notes = (payload.shopId == "policeArmory") and ("Law Enforcement - Issued By: " .. owner .. " | On: " .. os.date('%x')) or ("Weapon Purchase on " .. os.date('%x'))

	for index, item in ipairs(payload.items) do
		if not item.metadata or not item.metadata.serial then return end

		local itemData = ITEMS[item.name]

		local imageurl = GetItemIcon(item.name)

		exports['ps-mdt']:CreateWeaponInfo(item.metadata.serial, imageurl or "", notes, owner, itemData.caliber, itemData.label, source)
		lib.print.info("New " .. itemData.label .. ") registered in MDT for " .. player.PlayerData.name .. " (" .. owner .. "). Purchased at: " .. payload.shopId .. " (" .. payload.shopLocation .. ")")
	end
end)

AddEventHandler('onResourceStart', function(resource)
	if GetCurrentResourceName() ~= resource and "ox_inventory" ~= resource then return end

	for productType, productData in pairs(PRODUCTS) do
		for item, _ in pairs(productData) do
			if not ITEMS[(string.find(item, "weapon_") and (item):upper()) or item] then
				lib.print.error("Invalid Item: ", item, "in product table:", productType, "^7")
				productData[item] = nil
			end
		end
	end

	for shopID, shopData in pairs(LOCATIONS) do
		if not shopData.shopItems or not PRODUCTS[shopData.shopItems] then
			lib.print.error("A valid product ID (" .. shopData.shopItems .. ") for [" .. shopID .. "] was not found.")
			goto continue
		end

		local shopProducts = {}
		for item, data in pairs(PRODUCTS[shopData.shopItems]) do
			shopProducts[#shopProducts + 1] = {
				name = item,
				price = config.fluctuatePrices and (math.round(data.price * (math.random(80, 120) / 100))) or data.price or 0, -- Price fluctuation algorithm from ox_inventory https://github.com/overextended/ox_inventory/blob/e3a6b905a1b8bdbd3066d012522cf5993466d166/modules/shops/server.lua#L32
				license = data.license,
				info = data.info,
				count = data.defaultStock
			}
		end

		table.sort(shopProducts, function(a, b)
			return a.name < b.name
		end)

		registerShop(shopID, {
			name = shopData.Label,
			inventory = shopProducts,
			groups = shopData.groups,
			coords = shopData.coords
		})

		::continue::
	end
end)
