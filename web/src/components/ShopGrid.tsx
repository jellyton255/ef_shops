import { Text, ScrollArea, Grid, Center, Loader, Title, Tabs } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { useStoreShop } from "../stores/ShopStore";
import ItemCard from "./ItemCard";

function ShopTab(props: { tab: string }) {
	const { tab } = props;
	const { categorizedItems } = useStoreShop();

	const jobCards = useMemo(() => categorizedItems[tab]?.map((item) => <ItemCard item={item} />), [categorizedItems, tab]);

	return (
		<ScrollArea h="100%" scrollbarSize={4}>
			<Grid
				w="97%"
				h="100%"
				mx="auto"
				justify="flex-start"
				columns={21}
				styles={{
					inner: { height: "100%" },
				}}>
				{jobCards}
			</Grid>
		</ScrollArea>
	);
}

function ShopGrid() {
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

	const tabs = Object.keys(categorizedItems).map((category) => (
		<Tabs.Tab value={category}>
			<Text fw={700} fz={15} lh={1}>
				{category}
			</Text>
		</Tabs.Tab>
	));

	return (
		<Tabs value={activeTab} onChange={setActiveTab} h="100%" w="100%">
			<Tabs.List>{tabs}</Tabs.List>
			<Tabs.Panel value={activeTab} p="sm" h="97%" w="100%">
				<ShopTab tab={activeTab} />
			</Tabs.Panel>
		</Tabs>
	);
}

export default ShopGrid;
