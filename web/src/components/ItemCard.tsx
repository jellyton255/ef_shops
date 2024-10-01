import { useStoreShop } from "../stores/ShopStore";
import { useStoreSelf } from "../stores/PlayerDataStore";
import { ShopItem } from "../types/ShopItem";
import { SyntheticEvent } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { TooltipPortal } from "@radix-ui/react-tooltip";

export default function ItemCard({ item }: { item: ShopItem }) {
	const { addItemToCart, cartValue, cartWeight, CartItems } = useStoreShop();
	const { Weight, MaxWeight, Money, Licenses, Job } = useStoreSelf();

	const canNotAfford = cartValue + item.price > Money.Cash && cartValue + item.price > Money.Bank;
	const overWeight = Weight + cartWeight + (item.weight || 0) > MaxWeight;
	const currentItemQuantityInCart = CartItems.reduce((total, cartItem) => {
		return cartItem.id === item.id ? total + cartItem.quantity : total;
	}, 0);
	const inStock = item.count === undefined || item.count > currentItemQuantityInCart;
	const hasLicense = (!item.license && true) || (Licenses && Licenses[item.license]) === true;
	const hasCorrectGrade = !item.jobs || (item.jobs && item.jobs[Job.name] && item.jobs[Job.name] <= Job.grade);

	const disabled = canNotAfford || overWeight || !inStock || !hasLicense || !hasCorrectGrade;

	return (
		<Tooltip>
			<TooltipPortal>
				{disabled && (
					<TooltipContent>
						{(!hasLicense && "You need a " + item.license + " license to purchase this item.") ||
							(canNotAfford && "You cannot afford this item.") ||
							(overWeight && "You cannot carry this item.") ||
							(!inStock && "This item is out of stock.") ||
							(!hasCorrectGrade && "You don't have the correct job and rank to purchase this item")}
					</TooltipContent>
				)}
			</TooltipPortal>
			<TooltipTrigger asChild>
				<div
					className={`flex h-full min-h-40 grow cursor-pointer flex-col justify-between rounded-sm bg-card/50 p-2 transition-all data-[disabled=true]:cursor-not-allowed data-[disabled=true]:bg-card/10 data-[disabled=true]:grayscale hover:data-[disabled=false]:scale-105 data-[disabled=false]:hover:bg-card/30 hover:data-[disabled=false]:shadow-md`}
					data-disabled={disabled}
					onClick={() => {
						if (disabled) return;
						addItemToCart(item);
					}}
				>
					<div className="mx-auto flex w-full items-center justify-between gap-2">
						<p className="text-lg font-semibold">{item.price == 0 ? "FREE" : "$" + item.price}</p>
						{item.count !== undefined && <p className="text-lg font-semibold">{item.count}x</p>}
					</div>
					<div className="m-auto h-[80%]">
						<img
							onError={(event: SyntheticEvent<HTMLImageElement, Event>) => {
								event.currentTarget.src = "./Box.png";
							}}
							className="h-full w-full object-contain"
							src={item.imagePath}
							alt={item.label}
						/>
					</div>
					<div className="text-md text-center font-semibold">{item.label}</div>
				</div>
			</TooltipTrigger>
		</Tooltip>
	);
}
