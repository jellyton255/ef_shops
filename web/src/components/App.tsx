import { useMemo, useState } from "react";
import { debugData } from "../utils/debugData";
import { fetchNui } from "../utils/fetchNui";
import { Title, Flex, Stack, Card, ScrollArea, Button, alpha, Grid, useMantineTheme, Paper } from "@mantine/core";
import { VisibilityProvider } from "../providers/VisibilityProvider";
import DataHandler from "../DataHandler";
import { useStoreShop } from "../stores/ShopStore";
import Cart from "./Cart";
import ItemCard from "./ItemCard";
import ShopInterface from "./ShopInterface";

function App() {
	const theme = useMantineTheme();

	DataHandler();

	return (
		<VisibilityProvider>
			<Flex w="100vw" h="100vh" align="center" justify="flex-end" m={0}>
				<Paper
					w="75vw"
					h="82vh"
					mx="auto"
					p="md"
					bg={alpha(theme.colors.dark[7], 0.97)}
					style={{
						transition: "all 0.2s ease",
					}}>
					<ShopInterface />
				</Paper>
			</Flex>
		</VisibilityProvider>
	);
}

debugData([
	{
		action: "setVisible",
		data: true,
	},
]);

debugData([
	{
		action: "setCurrentShop",
		data: {
			shop: "247supermarket",
			label: "Shop",
			location: 1,
		},
	},
]);

debugData([
	{
		action: "setSelfData",
		data: {
			money: {
				Cash: 5.89,
				Bank: 21.32,
			},
			weight: 1400,
			maxWeight: 14000,
			licenses: {
				weapon: true,
			},
		},
	},
]);

debugData([
	{
		action: "setShopItems",
		data: [
			{
				name: "egochaser",
				type: "Redwood Wights Pack Long",
				label: "Redwood Wights Pack Long",
				category: "Cigarettes",
				price: 2,
				weight: 100,
				count: 23,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/egochaser.png",
			},
			{
				name: "egochaser",
				type: "Food",
				label: "Ego Chaser",
				category: "Food",
				price: 2,
				count: 5,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/egochaser.png",
			},
			{
				name: "egochaser",
				type: "Food",
				label: "Ego Chaser",
				price: 2,
				weight: 100,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/egochaser.png",
				license: "weapon",
			},
			{
				name: "egochaser",
				type: "Food",
				label: "Ego Chaser",
				price: 2,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/egochaser.png",
				license: "hunting",
			},
			{
				name: "egochaser",
				type: "Food",
				label: "Ego Chaser",
				price: 2,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/egochaser.png",
			},
			{
				name: "lighter",
				type: "tools",
				label: "Lighter",
				price: 2,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/lighter.png",
			},
			{
				name: "egochaser",
				type: "Food",
				label: "Ego Chaser",
				price: 2,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/egochaser.png",
			},
			{
				name: "egochaser",
				type: "Food",
				label: "Ego Chaser",
				price: 2,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/egochaser.png",
			},
			{
				name: "egochaser",
				type: "Food",
				label: "Ego Chaser",
				price: 2,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/egochaser.png",
			},
			{
				name: "egochaser",
				type: "Food",
				label: "Ego Chaser",
				price: 2,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/egochaser.png",
			},
			{
				name: "egochaser",
				type: "Food",
				label: "Ego Chaser",
				price: 2,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/egochaser.png",
			},
			{
				name: "egochaser",
				type: "Food",
				label: "Ego Chaser",
				price: 2,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/egochaser.png",
			},
			{
				name: "egochaser",
				type: "Food",
				label: "Ego Chaser",
				price: 2,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/egochaser.png",
			},
			{
				name: "egochaser",
				type: "Food",
				label: "Ego Chaser",
				price: 2,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/egochaser.png",
			},
			{
				name: "egochaser",
				type: "Food",
				label: "Ego Chaser",
				price: 2,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/egochaser.png",
			},
			{
				name: "egochaser",
				type: "Food",
				label: "Ego Chaser",
				price: 2,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/egochaser.png",
			},
			{
				name: "egochaser",
				type: "Food",
				label: "Ego Chaser",
				price: 2,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/egochaser.png",
			},
			{
				name: "egochaser",
				type: "Food",
				label: "Ego Chaser",
				price: 2,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/egochaser.png",
			},
			{
				name: "egochaser",
				type: "Food",
				label: "Ego Chaser",
				price: 2,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/egochaser.png",
			},
			{
				name: "egochaser",
				type: "Food",
				label: "Ego Chaser",
				price: 2,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/egochaser.png",
			},
			{
				name: "egochaser",
				type: "Food",
				label: "Ego Chaser",
				price: 2,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/egochaser.png",
			},
			{
				name: "egochaser",
				type: "Food",
				label: "Ego Chaser",
				price: 2,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/egochaser.png",
			},
			{
				name: "egochaser",
				type: "Food",
				label: "Ego Chaser",
				price: 2,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/egochaser.png",
			},
			{
				name: "egochaser",
				type: "Food",
				label: "Ego Chaser",
				price: 2,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/egochaser.png",
			},
			{
				name: "egochaser",
				type: "Food",
				label: "Ego Chaser",
				price: 2,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/egochaser.png",
			},
			{
				name: "egochaser",
				type: "Food",
				label: "Ego Chaser",
				price: 2,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/egochaser.png",
			},
			{
				name: "egochaser",
				type: "Food",
				label: "Ego Chaser",
				price: 2,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/egochaser.png",
			},
			{
				name: "egochaser",
				type: "Food",
				label: "Ego Chaser",
				price: 2,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/egochaser.png",
			},
			{
				name: "egochaser",
				type: "Food",
				label: "Ego Chaser",
				price: 2,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/egochaser.png",
			},
			{
				name: "egochaser",
				type: "Food",
				label: "Ego Chaser",
				price: 2,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/egochaser.png",
			},
			{
				name: "egochaser",
				type: "Food",
				label: "Ego Chaser",
				price: 2,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/egochaser.png",
			},
			{
				name: "egochaser",
				type: "Food",
				label: "Ego Chaser",
				price: 2,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/egochaser.png",
			},
			{
				name: "egochaser",
				type: "Food",
				label: "Ego Chaser",
				price: 2,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/egochaser.png",
			},
			{
				name: "egochaser",
				type: "Food",
				label: "Ego Chaser",
				price: 2,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/egochaser.png",
			},
			{
				name: "egochaser",
				type: "Food",
				label: "Ego Chaser",
				price: 2,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/egochaser.png",
			},
			{
				name: "egochaser",
				type: "Food",
				label: "Ego Chaser",
				price: 2,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/egochaser.png",
			},
			{
				name: "egochaser",
				type: "Food",
				label: "Ego Chaser",
				price: 2,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/egochaser.png",
			},
			{
				name: "egochaser",
				type: "Food",
				label: "Ego Chaser",
				price: 2,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/egochaser.png",
			},
		] as ShopItem[],
	},
]);

export default App;
