local ITEMS = exports.ox_inventory:Items()

---@param item string
---@return string | nil icon path
function GetItemIcon(item)
	if not item then
		error("item is nil")
	end

	local itemData = ITEMS[item]

	if not itemData then
		error("Attempted to get the icon for an item that does not exist: " .. item)
		return
	end

	local path = ("web/images/%s"):format((itemData.client and itemData.client.image) or (item .. ".png"))
	local resourceFile = LoadResourceFile("ox_inventory", path)

	return resourceFile and "nui://ox_inventory/" .. path or resourceFile
end
