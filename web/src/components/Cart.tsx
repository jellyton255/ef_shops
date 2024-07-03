import { faBasketShopping, faCreditCard, faFaceFrown, faMoneyBill1Wave, faWeightHanging, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Text, Stack, Title, Group, ActionIcon, NumberInput, Paper, Badge, Button, NumberFormatter, Tooltip, ScrollArea } from "@mantine/core";
import { useStoreShop } from "../stores/ShopStore";
import { formatMoney } from "../utils/misc";
import { useStoreSelf } from "../stores/PlayerDataStore";
import { useState } from "react";
import { fetchNui } from "../utils/fetchNui";
import { notifications } from "@mantine/notifications";
import classes from "./Style.module.css";

const formatWeight = (weight: number) => {
	weight *= 0.001;
	const roundedWeight = Math.round(weight * 100) / 100;
	return roundedWeight;
};

function getToolTip(canAfford: boolean, overWeight: boolean) {
	if (overWeight) return "You cannot carry all the items in the cart.";
	if (!canAfford) return "You cannot afford all the items in the cart.";
}

function PaymentButtons() {
	const { CartItems, getShopItemData, cartWeight } = useStoreShop();
	const { Money, Weight, MaxWeight } = useStoreSelf();

	const { ShopItems, CurrentShop, clearCart, setShopItems } = useStoreShop();
	const [awaitingPaymentCash, setAwaitingPaymentCash] = useState(false);
	const [awaitingPaymentCard, setAwaitingPaymentCard] = useState(false);

	const canAffordCash = CartItems?.reduce((acc, item) => acc + getShopItemData(item.id).price * item.quantity, 0) <= Money.Cash;
	const canAffordCard = CartItems?.reduce((acc, item) => acc + getShopItemData(item.id).price * item.quantity, 0) <= Money.Bank;
	const overWeight = Weight + cartWeight > MaxWeight;

	function finishPurchase() {
		// Create a new array with updated quantities
		const updatedShopItems = ShopItems.map((shopItem) => {
			const cartItem = CartItems.find((item) => item.id === shopItem.id);
			if (cartItem) {
				if (shopItem.count !== undefined) {
					return { ...shopItem, count: shopItem.count - cartItem.quantity };
				}
			}
			return shopItem;
		});

		// Update the state
		setShopItems(updatedShopItems);

		clearCart();
	}

	return (
		<div className="flex w-full flex-col justify-between">
			{(awaitingPaymentCash || awaitingPaymentCard) && <div className="container" />}
			<div className="flex w-full">
				<Tooltip label={getToolTip(canAffordCash, overWeight) || "Pay with Cash"} color={(canAffordCash && !overWeight && "green") || "red"} withArrow hidden={!CartItems || CartItems.length == 0}>
					<Button
						className="grow"
						color="green"
						size="lg"
						variant="light"
						loading={awaitingPaymentCash}
						disabled={!CartItems || CartItems.length == 0 || !canAffordCash || awaitingPaymentCard || overWeight}
						style={{ borderBottomRightRadius: 0, borderTopRightRadius: 0 }}
						onClick={() => {
							setAwaitingPaymentCash(true);
							fetchNui("purchaseItems", { items: CartItems, shop: CurrentShop, currency: "cash" }, true).then((res) => {
								setAwaitingPaymentCash(false);
								if (res) {
									finishPurchase();
									clearCart();
								}
							});
						}}
					>
						<FontAwesomeIcon size="lg" icon={faMoneyBill1Wave} />
					</Button>
				</Tooltip>
				<Tooltip label={getToolTip(canAffordCard, overWeight) || "Pay with Card"} color={(canAffordCard && !overWeight && "blue") || "red"} withArrow hidden={!CartItems || CartItems.length == 0}>
					<Button
						className="grow"
						color="blue"
						size="lg"
						variant="light"
						loading={awaitingPaymentCard}
						disabled={!CartItems || CartItems.length == 0 || !canAffordCard || awaitingPaymentCash || overWeight}
						style={{ borderBottomLeftRadius: 0, borderTopLeftRadius: 0 }}
						onClick={() => {
							setAwaitingPaymentCard(true);
							fetchNui("purchaseItems", { items: CartItems, shop: CurrentShop, currency: "card" }, true).then((res) => {
								setAwaitingPaymentCard(false);
								if (res) {
									finishPurchase();
									clearCart();
								}
							});
						}}
					>
						<FontAwesomeIcon size="lg" icon={faCreditCard} />
					</Button>
				</Tooltip>
			</div>
			<p className="mt-1 flex items-center justify-center gap-1 rounded-sm bg-indigo-800/25 px-2 py-1 text-lg font-medium text-indigo-400">
				<FontAwesomeIcon size="xs" icon={faWeightHanging} />
				<NumberFormatter value={formatWeight(Weight)} suffix="kg" thousandSeparator />
				{cartWeight > 0 && (
					<span className="font-bold">
						<NumberFormatter value={formatWeight(cartWeight)} prefix=" + " suffix="kg" thousandSeparator />
					</span>
				)}
				{" / "}
				<NumberFormatter value={formatWeight(MaxWeight)} suffix="kg" thousandSeparator />
			</p>
		</div>
	);
}

export default function Cart() {
	const { CartItems, addItemToCart, removeItemFromCart, getShopItemData, cartWeight } = useStoreShop();
	const { Money, Weight, MaxWeight } = useStoreSelf();

	const currentCartItems = CartItems?.map((item) => {
		const storeItem = getShopItemData(item.id);
		var price = storeItem.price;
		var title = <Title order={5}>{storeItem.label}</Title>;

		const handleQuantityChange = (value: number) => {
			if (value === item.quantity) return;

			const newCartValue = CartItems.reduce((acc, cartitem) => acc + getShopItemData(cartitem.id).price * cartitem.quantity, 0) + price * (value - item.quantity);
			const newCartWeight = Weight + cartWeight + (storeItem.weight || 0) * (value - item.quantity);

			const canAffordCash = newCartValue <= Money.Cash;
			const canAffordCard = newCartValue <= Money.Bank;
			const overWeight = newCartWeight > MaxWeight;

			if (overWeight) {
				notifications.show({
					title: "Too Heavy",
					message: `You cannot add anymore of: ${storeItem.label} to your cart, it's too heavy!`,
					icon: <FontAwesomeIcon icon={faWeightHanging} />,
					color: "red",
					classNames: classes,
				});
				return;
			}

			if (!canAffordCash && !canAffordCard) {
				notifications.show({
					title: "Cannot Afford",
					message: `You cannot add anymore of: ${storeItem.label} to your cart, you cannot afford it!`,
					icon: <FontAwesomeIcon icon={faMoneyBill1Wave} />,
					color: "red",
					classNames: classes,
				});
				return;
			}

			if (value > item.quantity) {
				addItemToCart(getShopItemData(item.id), value - item.quantity);
			} else {
				removeItemFromCart(item.id, item.quantity - value);
			}
		};

		return (
			<div className="mx-1 p-2" key={item.id}>
				<Group w="100%" justify="space-between" wrap="nowrap">
					{title}
					<Group justify="flex-end" ml="auto">
						<Text fz={18} fw={500}>
							${formatMoney(price * item.quantity)}
						</Text>

						<Group gap={6}>
							<NumberInput
								w={60}
								size="xs"
								value={item.quantity}
								max={storeItem.count}
								clampBehavior="strict"
								startValue={1}
								onChange={handleQuantityChange}
								isAllowed={(values) => {
									const newCartValue = CartItems.reduce((acc, cartitem) => acc + getShopItemData(cartitem.id).price * cartitem.quantity, 0) + price * (values.floatValue - item.quantity);
									const newCartWeight = Weight + cartWeight + (storeItem.weight || 0) * (values.floatValue - item.quantity);

									const canAffordCash = newCartValue <= Money.Cash;
									const canAffordCard = newCartValue <= Money.Bank;
									const overWeight = newCartWeight > MaxWeight;

									if (overWeight) {
										notifications.show({
											title: "Too Heavy",
											message: `You cannot add anymore of: ${storeItem.label} to your cart, it's too heavy!`,
											icon: <FontAwesomeIcon icon={faWeightHanging} />,
											color: "red",
											classNames: classes,
										});
										return false;
									}

									if (!canAffordCash && !canAffordCard) {
										notifications.show({
											title: "Cannot Afford",
											message: `You cannot add anymore of: ${storeItem.label} to your cart, you cannot afford it!`,
											icon: <FontAwesomeIcon icon={faMoneyBill1Wave} />,
											color: "red",
											classNames: classes,
										});
										return false;
									}

									return true;
								}}
								min={1}
								allowDecimal={false}
								allowNegative={false}
							/>
							<ActionIcon
								color="red"
								variant="light"
								onClick={() => {
									removeItemFromCart(item.id, null, true);
								}}
							>
								<FontAwesomeIcon icon={faXmark} />
							</ActionIcon>
						</Group>
					</Group>
				</Group>
			</div>
		);
	});

	return (
		<div className="col-span-3 flex size-full flex-col justify-between gap-1">
			<div className="flex justify-between gap-1">
				<Group gap={10} mx={4}>
					<FontAwesomeIcon size="lg" icon={faBasketShopping} />
					<Title order={3}>Cart</Title>
				</Group>

				<Text fz={18} fw={500} mx={4}>
					<Text fw={700} fz={19} component="span">
						{"Total: "}
					</Text>
					${formatMoney(CartItems?.reduce((acc, item) => acc + getShopItemData(item.id).price * item.quantity, 0) || 0)}
				</Text>
			</div>
			<div className={`flex h-0 grow flex-col gap-3 ${CartItems?.length > 0 && "overflow-y-auto"}`}>
				{CartItems?.length <= 0 ? (
					<div className="my-auto flex flex-col items-center gap-1">
						<FontAwesomeIcon icon={faFaceFrown} size="2x" />
						<h1 className="text-2xl font-bold">No Items in Cart</h1>
					</div>
				) : (
					<ScrollArea h="100%" scrollbarSize={4}>
						{currentCartItems}
					</ScrollArea>
				)}
			</div>
			<PaymentButtons />
		</div>
	);
}
