import { Text, ScrollArea, Center, Loader, Title, Tabs } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { useStoreShop } from "../stores/ShopStore";
import ItemCard from "./ItemCard";

function ShopTab(props: { tab: string }) {
	const { tab } = props;
	const { categorizedItems } = useStoreShop();

	const itemCards = useMemo(() => categorizedItems[tab]?.map((item) => <ItemCard key={item.id} item={item} />), [categorizedItems, tab]);

	return (
		<ScrollArea scrollbarSize={4} className="h-0 grow pb-4">
			<div className="grid h-0 w-full grow grid-cols-7 gap-3 px-4">{itemCards}</div>
		</ScrollArea>
	);
}

export default function ShopGrid() {
	const { ShopItems, categorizedItems } = useStoreShop();
	const [activeTab, setActiveTab] = useState<string>(Object.keys(categorizedItems)[0] || "Misc");

	useEffect(() => {
		setActiveTab(Object.keys(categorizedItems)[0] || "Misc");
	}, [categorizedItems]);

	if (!ShopItems)
		return (
			<Center h="100%">
				<Loader />
			</Center>
		);

	if (ShopItems.length <= 0)
		return (
			<Center h="100%">
				<Title>There are no items in this shop!</Title>
			</Center>
		);

	return (
		<Tabs value={activeTab} onChange={setActiveTab} className="flex size-full flex-col" classNames={{ panel: "h-0 grow flex flex-col p-0" }}>
			<Tabs.List>
				{Object.keys(categorizedItems).map((category) => (
					<Tabs.Tab value={category} key={category}>
						<Text fw={700} fz={15} lh={1}>
							{category}
						</Text>
					</Tabs.Tab>
				))}
			</Tabs.List>
			<Tabs.Panel value={activeTab} py="md" h="100%" w="100%">
				<ShopTab tab={activeTab} />
			</Tabs.Panel>
		</Tabs>
	);
}
