import { create } from "zustand";
import { CartItem, Shop, ShopItem } from "../types/ShopItem";

type ShopItems = {
	CurrentShop: Shop;
	ShopItems: ShopItem[] | null;
	categorizedItems: Record<string, ShopItem[]>; // New state for categorized items
	CartItems: CartItem[];
	cartWeight: number; // New state for tracking cart weight
	cartValue: number; // New state for tracking cart value
	setCurrentShop: (shop: Shop) => void;
	setShopItems: (items: ShopItem[]) => void;
	addItemToCart: (item: ShopItem, amount?: number) => void;
	removeItemFromCart: (itemId: number, amount?: number, removeAll?: boolean) => void;
	clearCart: () => void;
	getShopItemData: (itemId: number) => ShopItem | undefined;
};

export const useStoreShop = create<ShopItems>((set, get) => ({
	// Initial State
	CurrentShop: null,
	ShopItems: null,
	categorizedItems: {}, // Initialize categorized items
	CartItems: [],
	cartWeight: 0, // Initialize cart weight
	cartValue: 0, // Initialize cart value

	setCurrentShop: (shop: Shop) => {
		set(() => ({
			CurrentShop: shop,
		}));
	},

	setShopItems: (items: ShopItem[]) => {
		const categorizedItems: Record<string, ShopItem[]> = {};

		items.forEach((item) => {
			const category = item.category || "Misc";
			if (!categorizedItems[category]) {
				categorizedItems[category] = [];
			}
			categorizedItems[category].push(item);
		});

		set(() => ({
			ShopItems: [...items],
			categorizedItems, // Update categorized items
		}));
	},

	addItemToCart: (item: ShopItem, amount: number) => {
		const { CartItems, cartWeight, cartValue } = get();
		const existingItemIndex = CartItems.findIndex((cartItem) => cartItem.id === item.id);

		let newCartWeight = cartWeight + item.weight * (amount || 1); // Update cart weight
		let newCartValue = cartValue + item.price * (amount || 1); // Update cart value

		if (existingItemIndex >= 0) {
			// Item already exists in cart, increase quantity and update weight and value
			const updatedCartItems = CartItems.map((cartItem, index) => 
				index === existingItemIndex ? { ...cartItem, quantity: cartItem.quantity + (amount || 1) } : cartItem
			);
			set(() => ({
				CartItems: updatedCartItems,
				cartWeight: newCartWeight,
				cartValue: newCartValue,
			}));
		} else {
			// Item not in cart, add new item
			const newItem = { id: item.id, name: item.name, quantity: amount || 1, weight: item.weight, price: item.price };
			set(() => ({
				CartItems: [...CartItems, newItem],
				cartWeight: newCartWeight,
				cartValue: newCartValue,
			}));
		}
	},

	removeItemFromCart: (itemId: number, amount?: number, removeAll: boolean = false) => {
		const { CartItems, cartWeight, cartValue, getShopItemData } = get();
		const existingItemIndex = CartItems.findIndex((cartItem) => cartItem.id === itemId);

		if (existingItemIndex >= 0) {
			const existingItem = CartItems[existingItemIndex];
			const shopItem = getShopItemData(existingItem.id);
			let itemWeightReduction = shopItem.weight * (removeAll ? existingItem.quantity : amount || 1);
			let itemValueReduction = shopItem.price * (removeAll ? existingItem.quantity : amount || 1);

			if (existingItem.quantity > 1 && !removeAll) {
				// Decrease quantity, update weight and value
				const updatedCartItems = CartItems.map((cartItem, index) => 
					index === existingItemIndex ? { ...cartItem, quantity: cartItem.quantity - (amount || 1) } : cartItem
				);
				set(() => ({
					CartItems: updatedCartItems,
					cartWeight: cartWeight - itemWeightReduction,
					cartValue: cartValue - itemValueReduction,
				}));
			} else {
				// Remove item entirely, update weight and value
				const updatedCartItems = CartItems.filter((_, index) => index !== existingItemIndex);
				set(() => ({
					CartItems: updatedCartItems,
					cartWeight: cartWeight - itemWeightReduction,
					cartValue: cartValue - itemValueReduction,
				}));
			}
		}
	},

	clearCart: () => {
		set(() => ({
			CartItems: [],
			cartWeight: 0, // Reset cart weight
			cartValue: 0, // Reset cart value
		}));
	},

	getShopItemData: (itemId: number) => {
		const { ShopItems } = get();
		if (ShopItems) {
			return ShopItems.find((item) => item.id === itemId);
		}
		return undefined; // Return undefined if the item is not found or if ShopItems is null
	},
}));
