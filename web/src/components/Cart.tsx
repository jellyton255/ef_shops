import { faBasketShopping, faFaceDisappointed, faXmark } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Text, ScrollArea, Center, Stack, Title, Group, Card, Box, ActionIcon, NumberInput, Paper } from "@mantine/core";
import { useMemo } from "react";
import { useStoreShop } from "../stores/ShopStore";
import { formatMoney } from "../utils/misc";
import { useStoreSelf } from "../stores/PlayerDataStore";
import { notifications } from "@mantine/notifications";
import classes from "./Style.module.css";
					<NumberFormatter value={formatWeight(Weight)} suffix="kg" thousandSeparator />
					{cartWeight > 0 && (
						<Text component="span">
							<NumberFormatter value={formatWeight(cartWeight)} prefix=" + " suffix="kg" thousandSeparator />
						</Text>
					)}
					{" / "}
					<NumberFormatter value={formatWeight(MaxWeight)} suffix="kg" thousandSeparator />

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
										const canAffordCash = CartItems?.reduce((acc, cartitem) => acc + getShopItemData(cartitem.name).price * cartitem.quantity, 0) + price <= Money.Cash;
										const canAffordCard = CartItems?.reduce((acc, cartitem) => acc + getShopItemData(cartitem.name).price * cartitem.quantity, 0) + price <= Money.Bank;
										const overWeight = Weight + cartWeight + (storeItem.weight || 0) > MaxWeight;

										if (overWeight || (!canAffordCash && !canAffordCard)) return;
										addItemToCart(getShopItemData(item.name), value - item.quantity);
									} else removeItemFromCart(item.name, item.quantity - value);
								}}
										notifications.show({
											title: "Too Heavy",
											message: `You cannot add anymore of: ${storeItem.label} to your cart, it's too heavy!`,
											icon: <FontAwesomeIcon icon={faWeightHanging} />,
											color: "red",
											classNames: classes,
										});
										notifications.show({
											title: "Cannot Afford",
											message: `You cannot add anymore of: ${storeItem.label} to your cart, you cannot afford it!`,
											icon: <FontAwesomeIcon icon={faMoneyBill1Wave} />,
											color: "red",
											classNames: classes,
										});
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
			<Box h="91%">
				<Group justify="space-between" mb={4}>
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
				{(CartItems?.length > 0 && (
					<ScrollArea h="100%" scrollbarSize={4} scrollHideDelay={0}>
						<Stack h="100%" gap={6}>
							{currentCartItems}
						</Stack>
					</ScrollArea>
				)) || (
					<Center h="96%">
						<Stack my="auto" gap={2}>
							<FontAwesomeIcon icon={faFaceDisappointed} size="2x" />
							<Title order={3}>No Items in Cart</Title>
						</Stack>
					</Center>
				)}
			</Box>
		),

		[CartItems]
	);
}

export default Cart;
