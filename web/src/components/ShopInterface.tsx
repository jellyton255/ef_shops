import { Text, Stack, Title, Grid, Button, Skeleton, Group, NumberFormatter, Badge, Tooltip, CloseButton } from "@mantine/core";
import { useState } from "react";
import { fetchNui } from "../utils/fetchNui";
import { useStoreShop } from "../stores/ShopStore";
import { useStoreSelf } from "../stores/PlayerDataStore";
import { faCreditCard, faMoneyBill1Wave, faWeightHanging } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cart from "./Cart";
import ShopGrid from "./ShopGrid";
import { isEnvBrowser } from "../utils/misc";

function ShopTitle() {
	const { CurrentShop } = useStoreShop();

	if (!CurrentShop)
		return (
			<Stack h="fit-content" ml={32} gap={8}>
				<Skeleton height={8} width={450} />
				<Skeleton height={8} width={350} />
				<Skeleton height={8} width={150} />
			</Stack>
		);

	return <Title order={1}>{CurrentShop?.label}</Title>;
}

export const formatWeight = (weight: number) => {
	weight *= 0.001;
	const roundedWeight = Math.round(weight * 100) / 100;
	return roundedWeight;
};

function PlayerData() {
	const { Money } = useStoreSelf();

	if (!PlayerData)
		return (
			<Stack h="fit-content" ml={32} gap={8}>
				<Skeleton height={8} width={450} />
				<Skeleton height={8} width={350} />
				<Skeleton height={8} width={150} />
			</Stack>
		);

	return (
		<Group h="fit-content" gap={6} mr={390}>
			<Badge size="lg" leftSection={<FontAwesomeIcon size="lg" icon={faMoneyBill1Wave} />} color="green" radius="sm" variant="light">
				<Text fw={700} ta="right" mx={6}>
					<NumberFormatter prefix="$" value={Money.Cash} thousandSeparator />
				</Text>
			</Badge>
			<Badge size="lg" leftSection={<FontAwesomeIcon size="lg" icon={faCreditCard} />} color="blue" radius="sm" variant="light">
				<Text fw={700} ta="right" mx={6}>
					<NumberFormatter prefix="$" value={Money.Bank} thousandSeparator />
				</Text>
			</Badge>
		</Group>
	);
}

function getToolTip(canAfford: boolean, overWeight: boolean) {
	if (overWeight) return "You cannot carry all the items in the cart.";
	if (!canAfford) return "You cannot afford all the items in the cart.";
}

function ShopInterface() {
	const { ShopItems, CartItems, CurrentShop, getShopItemData, clearCart, setShopItems, cartWeight } = useStoreShop();
	const { Money, Weight, MaxWeight } = useStoreSelf();
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
		<Stack h="100%">
			<Group w="100%" justify="space-between">
				<ShopTitle />
				<PlayerData />
				<CloseButton
					onClick={() => {
						if (!isEnvBrowser()) fetchNui("hideFrame");
					}}
				/>
			</Group>
			<Grid
				w="99%"
				h="95%"
				mx="auto"
				columns={13}
				styles={{
					inner: { height: "100%" },
				}}>
				<Grid.Col h="100%" span={10}>
					<ShopGrid />
				</Grid.Col>
				<Grid.Col h="100%" span={3}>
					<Stack h="100%" gap={2} justify="space-between">
						<Cart />
						<Stack gap={0} justify="space-between">
							{(awaitingPaymentCash || awaitingPaymentCard) && <div className="container" />}
							<Group w="100%" gap={0} grow>
								<Tooltip
									label={getToolTip(canAffordCash, overWeight) || "Pay with Cash"}
									color={(canAffordCash && !overWeight && "green") || "red"}
									withArrow
									hidden={!CartItems || CartItems.length == 0}>
									<Button
										color="green"
										size="lg"
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
								<Tooltip
									label={getToolTip(canAffordCard, overWeight) || "Pay with Card"}
									color={(canAffordCard && !overWeight && "blue") || "red"}
									withArrow
									hidden={!CartItems || CartItems.length == 0}>
									<Button
										color="blue"
										size="lg"
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
											<NumberFormatter value={formatWeight(cartWeight)} prefix="+" suffix="kg" thousandSeparator />
										</Text>
									)}
									/
									<NumberFormatter value={formatWeight(MaxWeight)} suffix="kg" thousandSeparator />
								</Text>
							</Badge>
						</Stack>
					</Stack>
				</Grid.Col>
			</Grid>
		</Stack>
	);
}

export default ShopInterface;
