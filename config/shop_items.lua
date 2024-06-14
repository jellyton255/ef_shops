---@class ShopItem
---@field price number base price of the item
---@field defaultStock? integer the amount of items available in the shop by default
---@field category? string the category of the item in the shop (e.g. 'Snacks', 'Tools', 'Firearms', 'Ammunition', 'Drinks')
---@field license? string the license required to purchase the item
---@field jobs? table<string, number> map of group names to min grade required to access the shop
---@field metadata? table | string

---@type table<string, table<string, ShopItem>>
return {
	normal = {
		water = { price = 1, defaultStock = 50, category = 'Snacks' },
		burger = { price = 3, defaultStock = 50, category = 'Snacks' },
		cola = { price = 3, defaultStock = 50, category = 'Snacks' },
	},
	liquor = {
		water = { price = 1, defaultStock = 50, category = 'Snacks' },
		burger = { price = 3, defaultStock = 50, category = 'Snacks' },
		cola = { price = 3, defaultStock = 50, category = 'Snacks' },
	},
	hardware = {
		lockpick = { price = 20, defaultStock = 50, category = 'Tools' },
	},
	weapons = {
		WEAPON_KNIFE = { price = 80, defaultStock = 250, category = 'Point Defense' },
		WEAPON_BAT = { price = 45, defaultStock = 250, category = 'Point Defense' },
		WEAPON_NIGHTSTICK = { price = 450, category = 'Point Defense' },
		WEAPON_KNUCKLE = { price = 950, defaultStock = 250, category = 'Point Defense' },
		WEAPON_PISTOL = { price = 2450, defaultStock = 5, license = "weapon", category = 'Firearms' },
		WEAPON_SNSPISTOL = { price = 1850, defaultStock = 5, license = "weapon", category = 'Firearms' },
		["ammo-9"] = { price = 4, defaultStock = 9500, license = "weapon", category = 'Ammunition' },
		["ammo-45"] = { price = 7, defaultStock = 5500, license = "weapon", category = 'Ammunition' },
	},
	electronics = {
		phone = { price = 55 },
		radio = { price = 85 },
	},
}
