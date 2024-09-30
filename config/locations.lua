---@class ShopLocation
---@field label string the label of the shop location
---@field coords? vector3[] | vector4[] coordinates of shop locations (can be ommited if you only want to open the shop using an external resource)
---@field model? number[] | string[] | number | string hash of model (ped/object) to pick from when spawning a shop vendor
---@field shopItems string which table to pull shop items from
---@field blip? { sprite: number, color: number, scale?: number, disabled: boolean } blip data for the shop
---@field jobs? table<string, number> map of group names to min grade required to access the shop
---@field target? { label?: string, radius?: number, icon?: string } target data for the shop

---@type table<string, ShopLocation>
return {
	supermarket = {
		label = "Convenience Store", -- 24/7 Supermarket
		model = {
			`mp_m_shopkeep_01`,
			`S_F_Y_Shop_LOW`,
			`S_F_Y_SweatShop_01`,
			`S_F_M_RetailStaff_01`,
		},
		coords = {
			-- Normal Locations
			--[[
				vector4(24.5, -1346.19, 29.5, 266.78),
				vector4(-3039.91, 584.26, 7.91, 16.79),
				vector4(-3243.27, 1000.1, 12.83, 358.73),
				vector4(1728.28, 6416.03, 35.04, 242.45),
				vector4(1697.96, 4923.04, 42.06, 326.61),
				vector4(1959.6, 3740.93, 32.34, 296.84),
				vector4(549.16, 2670.35, 42.16, 92.53),
				vector4(2677.41, 3279.8, 55.24, 334.16),
				vector4(2556.19, 380.89, 108.62, 355.58),
				vector4(372.82, 327.3, 103.57, 255.46),
				vector4(161.21, 6642.32, 31.61, 223.57),
				vector4(-553.02, -583.2, 34.68, 178.34),
			]]

			-- Gobz Locations
			vector4(24.91, -1346.86, 29.5, 268.37),
			vector4(-3039.64, 584.78, 7.91, 21.88),
			vector4(-3242.73, 1000.46, 12.83, 2.08),
			vector4(1728.44, 6415.4, 35.04, 243.26),
			vector4(1697.96, 4923.04, 42.06, 326.61),
			vector4(1960.26, 3740.6, 32.34, 300.45),
			vector4(548.67, 2670.94, 42.16, 101.0),
			vector4(2677.97, 3279.95, 55.24, 325.89),
			vector4(2556.8, 381.27, 108.62, 359.15),
			vector4(373.08, 326.75, 103.57, 253.14),
			vector4(161.2, 6641.74, 31.7, 221.02),

			-- LTD Gasoline Locations
			vector4(-47.42, -1758.67, 29.42, 47.26),
			vector4(-706.17, -914.64, 19.22, 88.77),
			vector4(-1819.53, 793.49, 138.09, 131.46),
			vector4(1164.82, -323.66, 69.21, 106.86),

			-- Xero Gas Stations
			vector4(292.57, -1273.32, 29.42, 0.05), -- Xero Strawberry 834
			vector4(-2070.68, -334.05, 13.31, 353.35), -- Xero Pacific Bluffs 682
			vector4(-538.61, -1221.4, 18.46, 239.83), -- Xero Little Seoul 724

			-- Ron Gas Stations
			vector4(-2550.3, 2312.92, 33.23, 269.68), -- Ron Great Ocean Hwy
			vector4(-1421.36, -271.14, 46.3, 44.25), -- Ron Morningwood

			-- Globe Oil Locations
			vector4(644.72, 257.69, 103.3, 325.93),
			vector4(-345.66, -1473.96, 30.79, 181.86)
		},
		shopItems = "normal",
		blip = {
			sprite = 52,
			color = 2,
			scale = 0.9
		}
	},

	-- Rob's Liquor Locations
	robsliquor = {
		label = "Rob's Liquor",
		model = {
			`cs_nervousron`,
			`IG_RussianDrunk`,
			`A_F_M_TrampBeac_01`,
			`A_M_M_Tramp_01`,
			`S_F_M_RetailStaff_01`,
		},
		coords = {
			vector4(-1221.38, -907.89, 12.33, 27.51),
			vector4(-1486.82, -377.48, 40.16, 130.89),
			vector4(-2966.41, 391.62, 15.04, 87.82),
			vector4(1165.15, 2710.78, 38.16, 177.96),
			vector4(1134.3, -983.26, 46.42, 276.3),
			vector4(1744.65, 3611.95, 34.89, 311.19)

		},
		shopItems = "bar",
		blip = {
			sprite = 827,
			color = 47,
		}
	},

	-- Hardware Store Locations
	hardware = {
		label = "Hardware Store",
		model = {
			`s_m_m_autoshop_02`,
			`S_F_M_Autoshop_01`,
			`S_M_M_AutoShop_01`,
			`S_M_M_Autoshop_03`,
			`IG_Benny`,
			`IG_Benny_02`,
			`MP_F_BennyMech_01`,
			`S_F_M_Autoshop_01`,
			`S_M_M_Autoshop_03`,
		},
		coords = {
			vector4(46.52, -1749.55, 29.64, 50.82),
			vector4(2745.87, 3468.98, 55.67, 247.08),
			vector4(-421.65, 6135.97, 31.88, 232.98),
			vector4(1167.28, -1347.11, 34.91, 276.86),
			vector4(2665.97, 3385.94, 57.12, 241.55)
		},
		shopItems = "hardware",
		blip = {
			sprite = 402,
			color = 5,
		}
	},

	-- Ammunation Locations
	ammunation = {
		label = "Ammunation",
		target = { label = "Open Ammunation" },
		model = {
			`S_M_M_AmmuCountry`,
			`S_M_Y_AmmuCity_01`,
			`MP_M_WareMech_01`,
			`A_M_M_Farmer_01`,
			`MP_M_ExArmy_01`,
			`S_M_Y_ArmyMech_01`,
			`S_M_M_Armoured_02`,
		},
		coords = {
			vector4(808.94, -2158.99, 29.62, 330.26),
			vector4(-660.98, -933.6, 21.83, 154.74),
			vector4(1693.16, 3761.94, 34.71, 189.83),
			vector4(-330.72, 6085.81, 31.45, 190.52),
			vector4(253.41, -51.67, 69.94, 28.88),
			vector4(23.69, -1105.95, 29.8, 124.58),
			vector4(2566.81, 292.54, 108.73, 320.09),
			vector4(-1118.19, 2700.5, 18.55, 185.31),
			vector4(841.31, -1035.28, 28.19, 334.27),
			vector4(-1304.44, -395.68, 36.7, 41.85),
		},
		shopItems = "weapons",
		blip = {
			sprite = 567,
			color = 1,
		}
	},
	digitalden = {
		label = "Digital Den",
		model = {
			`S_M_M_LifeInvad_01`,
			`IG_Ramp_Hipster`,
			`A_M_Y_Hipster_02`,
			`A_F_Y_Hipster_01`,
			`IG_LifeInvad_01`,
			`IG_LifeInvad_02`,
			`CS_LifeInvad_01`,
		},
		coords = {
			vector4(1767.11, 3646.52, 34.89, 116.98)
		},
		shopItems = "electronics",
		blip = {
			sprite = 606,
			color = 7,
		}
	},
}
