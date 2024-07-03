import { Tooltip, Grid } from "@mantine/core";
import { useStoreShop } from "../stores/ShopStore";
import { useStoreSelf } from "../stores/PlayerDataStore";
import { useHover } from "@mantine/hooks";
import { ShopItem } from "../types/ShopItem";

export default function ItemCard(props: { item: ShopItem }) {
	const { item } = props;
	const { addItemToCart, cartValue, cartWeight, CartItems } = useStoreShop();
	const { Weight, MaxWeight, Money, Licenses, Job } = useStoreSelf();

	const canNotAfford = cartValue + item.price > Money.Cash && cartValue + item.price > Money.Bank;
	const overWeight = Weight + cartWeight + item.weight > MaxWeight;
	const currentItemQuantityInCart = CartItems.reduce((total, cartItem) => {
		return cartItem.id === item.id ? total + cartItem.quantity : total;
	}, 0);
	const inStock = item.count === undefined || item.count > currentItemQuantityInCart;
	const hasLicense = (!item.license && true) || (Licenses && Licenses[item.license]) === true;
	const hasCorrectGrade = !item.jobs || (item.jobs && item.jobs[Job.name] && item.jobs[Job.name] <= Job.grade);

	const disabled = canNotAfford || overWeight || !inStock || !hasLicense || !hasCorrectGrade;

	const { hovered, ref } = useHover();

	return (
		<Tooltip
			label={
				(!hasLicense && "You need a " + item.license + " license to purchase this item.") ||
				(canNotAfford && "You cannot afford this item.") ||
				(overWeight && "You cannot carry this item.") ||
				(!inStock && "This item is out of stock.") ||
				(!hasCorrectGrade && "You don't have the correct job and rank to purchase this item")
			}
			disabled={!canNotAfford && !overWeight && hasLicense && hasCorrectGrade && inStock}
		>
			<Grid.Col span={1} className="grow">
				<div
					ref={ref}
					className={`flex h-full flex-col justify-between rounded-sm bg-neutral-800 p-2 transition-all ${!disabled ? "hover:bg-neutral-600/20" : ""} ${
						disabled ? "bg-opacity-20" : "bg-opacity-80"
					} ${disabled ? "cursor-not-allowed" : "cursor-pointer"} ${disabled ? "grayscale" : ""} ${
						hovered && !disabled ? "scale-105 shadow-md" : ""
					}`}
					onClick={() => {
						if (disabled) return;
						addItemToCart(item);
					}}
				>
					<div className="mx-auto flex w-full flex-nowrap justify-between px-1">
						<p className="text-lg font-semibold">${item.price}</p>
						{item.count !== undefined && <p className="text-lg font-semibold">{item.count}x</p>}
					</div>
					<div className="m-auto flex h-[80%]">
						<img
							onError={(event: React.SyntheticEvent<HTMLImageElement, Event>) => {
								console.log(event);
								event.currentTarget.src = "./Box.png";
							}}
							className="h-full w-full object-contain"
							src={item.imagePath}
							alt={item.label}
							//fallbackSrc="./Box.png"
							//fit="contain"
						/>
					</div>
					<p className="text-md text-center font-semibold">{item.label}</p>
				</div>
			</Grid.Col>
		</Tooltip>
	);
}
