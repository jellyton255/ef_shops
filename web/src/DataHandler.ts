import { useNuiEvent } from "./hooks/useNuiEvent";
import { useStoreSelf } from "./stores/PlayerDataStore";
import { useStoreShop } from "./stores/ShopStore";

function DataHander() {
	const { setShopItems, setCurrentShop, clearCart } = useStoreShop();
	const { setSelfData } = useStoreSelf();

	useNuiEvent("setSelfData", setSelfData);
	useNuiEvent("setCurrentShop", setCurrentShop);
	useNuiEvent("setShopItems", (items: ShopItem[]) => {
		if (items) setShopItems(items);
		clearCart();
	});
}

export default DataHander;
