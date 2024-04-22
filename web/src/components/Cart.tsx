import { faBasketShopping, faFaceDisappointed, faXmark } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Text, Stack, Title, Group, ActionIcon, NumberInput, Paper, Badge, Button, NumberFormatter, Tooltip } from "@mantine/core";
import { useMemo } from "react";
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

	const canAffordCash = CartItems?.reduce((acc, item) => acc + getShopItemData(item.name).price * item.quantity, 0) <= Money.Cash;
	const canAffordCard = CartItems?.reduce((acc, item) => acc + getShopItemData(item.name).price * item.quantity, 0) <= Money.Bank;
	const overWeight = Weight + cartWeight > MaxWeight;

	function finishPurchase() {
		// Create a new array with updated quantities
		const updatedShopItems = ShopItems.map((shopItem) => {
			const cartItem = CartItems.find((item) => item.name === shopItem.name);
			if (cartItem) {
				return { ...shopItem, count: shopItem.count - cartItem.quantity };
			} else {
				return shopItem;
			}
		});

		// Update the state
		setShopItems(updatedShopItems);

		clearCart();
	}

	return (
		<Stack gap={0} justify="space-between">
			{(awaitingPaymentCash || awaitingPaymentCard) && <div className="container" />}
			<Group w="100%" gap={0} grow>
				<Tooltip label={getToolTip(canAffordCash, overWeight) || "Pay with Cash"} color={(canAffordCash && !overWeight && "green") || "red"} withArrow hidden={!CartItems || CartItems.length == 0}>
					<Button
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
						}}>
						<FontAwesomeIcon size="lg" icon={faMoneyBill1Wave} />
					</Button>
				</Tooltip>
				<Tooltip label={getToolTip(canAffordCard, overWeight) || "Pay with Card"} color={(canAffordCard && !overWeight && "blue") || "red"} withArrow hidden={!CartItems || CartItems.length == 0}>
					<Button
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
						}}>
						<FontAwesomeIcon size="lg" icon={faCreditCard} />
					</Button>
				</Tooltip>
			</Group>
			<Badge w="100%" mt={6} size="lg" leftSection={<FontAwesomeIcon icon={faWeightHanging} />} color="indigo" radius="sm" variant="light">
				<Text fw={700} ta="right" mx={6}>
					<NumberFormatter value={formatWeight(Weight)} suffix="kg" thousandSeparator />
					{cartWeight > 0 && (
						<Text component="span">
							<NumberFormatter value={formatWeight(cartWeight)} prefix=" + " suffix="kg" thousandSeparator />
						</Text>
					)}
					{" / "}
					<NumberFormatter value={formatWeight(MaxWeight)} suffix="kg" thousandSeparator />
				</Text>
			</Badge>
		</Stack>
	);
}

function Cart() {
	const { CartItems, addItemToCart, removeItemFromCart, getShopItemData, cartWeight } = useStoreShop();
	const { Money, Weight, MaxWeight } = useStoreSelf();

	const currentCartItems = CartItems?.map((item) => {
		const storeItem = getShopItemData(item.name);
		var price = storeItem.price;
		var title = <Title order={4}>{storeItem.label}</Title>;

		return (
			<Paper key={item.name} p="sm">
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
								onChange={(value: number) => {
									if (value === item.quantity) return;

									if (value > item.quantity) {
										addItemToCart(getShopItemData(item.name), value - item.quantity);
									} else removeItemFromCart(item.name, item.quantity - value);
								}}
								isAllowed={(values) => {
									const canAffordCash = CartItems?.reduce((acc, cartitem) => acc + getShopItemData(cartitem.name).price * cartitem.quantity, 0) + price <= Money.Cash;
									const canAffordCard = CartItems?.reduce((acc, cartitem) => acc + getShopItemData(cartitem.name).price * cartitem.quantity, 0) + price <= Money.Bank;
									const overWeight = Weight + cartWeight + (storeItem.weight || 0) * values.floatValue > MaxWeight;
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
									removeItemFromCart(item.name, null, true);
								}}>
								<FontAwesomeIcon icon={faXmark} />
							</ActionIcon>
						</Group>
					</Group>
				</Group>
			</Paper>
		);
	});

	return useMemo(
		() => (
			<Stack h="100%" gap={12} justify="space-between">
				<Group justify="space-between">
					<Group gap={10} mx={4}>
						<FontAwesomeIcon size="lg" icon={faBasketShopping} />
						<Title order={3}>Cart</Title>
					</Group>

					<Text fz={18} fw={500} mx={4}>
						<Text fw={700} fz={19} component="span">
							Total:{" "}
						</Text>
						${formatMoney(CartItems?.reduce((acc, item) => acc + getShopItemData(item.name).price * item.quantity, 0) || 0)}
					</Text>
				</Group>

				<Stack gap={6} style={{ overflow: "auto" }} mb={CartItems?.length > 0 && "auto"}>
					{CartItems?.length <= 0 && (
						<Stack my="auto" gap={2} align="center">
							<Title order={3}>No Items in Cart</Title>
						</Stack>
					)}
					{currentCartItems}
				</Stack>

				</Stack>
		),

		[CartItems]
	);
}

export default Cart;
