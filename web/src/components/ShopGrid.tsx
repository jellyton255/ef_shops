import { useEffect, useMemo, useState } from "react";
import { useStoreShop } from "../stores/ShopStore";
import ItemCard from "./ItemCard";
import { TooltipProvider } from "./ui/tooltip";
import Loader from "./Loader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "./ui/scroll-area";

function ShopTab({ tab }: { tab: string }) {
	const { categorizedItems } = useStoreShop();

	return useMemo(() => categorizedItems[tab]?.map((item) => <ItemCard key={item.id} item={item} />), [categorizedItems, tab]);
}

export default function ShopGrid() {
	const { ShopItems, categorizedItems } = useStoreShop();
	const [activeTab, setActiveTab] = useState<string>(Object.keys(categorizedItems)[0] || "Misc");

	useEffect(() => {
		setActiveTab(Object.keys(categorizedItems)[0] || "Misc");
	}, [categorizedItems]);

	if (!ShopItems)
		return (
			<div className="flex size-full flex-col items-center justify-center">
				<Loader />
			</div>
		);

	if (ShopItems.length <= 0)
		return (
			<div className="flex size-full scroll-m-20 flex-col items-center justify-center text-2xl font-semibold tracking-tight">
				There are no items in this shop!
			</div>
		);

	return (
		<Tabs value={activeTab} onValueChange={setActiveTab} className="flex size-full flex-col">
			<TabsList className="justify-start bg-transparent">
				{Object.keys(categorizedItems).map((category) => (
					<TabsTrigger value={category} key={category} className="rounded-none border-primary data-[state=active]:border-b-2">
						{category}
					</TabsTrigger>
				))}
			</TabsList>
			<TabsContent value={activeTab} className="flex size-full flex-col">
				<ScrollArea className="h-0 grow">
					<div className="grid h-full w-full grow grid-cols-7 gap-3 px-4">
						<TooltipProvider delayDuration={0} disableHoverableContent={true}>
							<ShopTab tab={activeTab} />
						</TooltipProvider>
					</div>
				</ScrollArea>
			</TabsContent>
		</Tabs>
	);
}
