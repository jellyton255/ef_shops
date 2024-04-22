import { Text, Image, Grid, Stack, Group, Paper, Tooltip } from "@mantine/core";
import { useStoreShop } from "../stores/ShopStore";
import { useStoreSelf } from "../stores/PlayerDataStore";
import { useHover } from "@mantine/hooks";
import { ShopItem } from "../types/ShopItem";

function ItemCard(props: { item: ShopItem }) {
	const { item } = props;
	const { addItemToCart, cartValue, cartWeight, CartItems } = useStoreShop();
	const { Weight, MaxWeight, Money, Licenses, Job } = useStoreSelf();

	const canNotAfford = cartValue + item.price > Money.Cash && cartValue + item.price > Money.Bank;
	const overWeight = Weight + cartWeight + item.weight > MaxWeight;
	const currentItemQuantityInCart = CartItems.reduce((total, cartItem) => {
		return cartItem.name === item.name ? total + cartItem.quantity : total;
	}, 0);
	const inStock = !item.count || item.count > currentItemQuantityInCart;
	const hasLicense = (!item.license && true) || (Licenses && Licenses[item.license]) == true;
	const hasCorrectGrade = !item.jobs || (item.jobs && item.jobs[Job.name] && item.jobs[Job.name] <= Job.grade);

	const disabled = canNotAfford || overWeight || !inStock || !hasLicense || !hasCorrectGrade;

	const { hovered, ref } = useHover();

	return (
		<Grid.Col span={3}>
			<Tooltip
				label={(!hasLicense && "You need a " + item.license + " license to purchase this item.") || (canNotAfford && "You cannot afford this item.") || (overWeight && "You cannot carry this item.")}
				disabled={!canNotAfford && !overWeight}>
				<Paper
					w="100%"
					h="100%"
					bg="dark.6"
					p="sm"
					ref={ref}
					onClick={() => {
						if (disabled) return;
						addItemToCart(item);
					}}
					style={{
						cursor: disabled ? "not-allowed" : "pointer",
						transition: "all 0.2s ease",
						opacity: disabled ? 0.5 : 1, // Reduced opacity for disabled items
						filter: disabled ? "grayscale(100%)" : "none", // Grayscale filter for disabled items
						//pointerEvents: disabled ? "none" : "auto", // Prevent interaction if disabled
						transform: hovered && (disabled ? "none" : "scale(1.05)"), // Slightly scale up when hovered
						boxShadow: hovered && (disabled ? "none" : "0 0 10px rgba(0, 0, 0, 0.2)"), // Add a shadow when hovered
					}}>
					<Stack w="100%" h="100%" justify="space-between" gap={0}>
						<Group w="100%" mx="auto" justify="space-between" wrap="nowrap">
							<Text fw={700} fz={19}>
								${item.price}
							</Text>
							{item.count && (
								<Text fw={700} fz={19}>
									{item.count}x
								</Text>
							)}
						</Group>
						<Group h="100%">
							<Image src={item.imagePath} alt={item.label} fallbackSrc="./Box.png" w="75%" h="100%" mx="auto" mt={-5} my="auto" fit="contain" />
						</Group>
						<Text fz={18} fw={600} ta="center">
							{item.label}
						</Text>
					</Stack>
				</Paper>
			</Tooltip>
		</Grid.Col>
	);
}

export default ItemCard;
