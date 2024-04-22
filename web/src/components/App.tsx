import { debugData } from "../utils/debugData";
import { Flex, alpha, useMantineTheme, Paper } from "@mantine/core";
import { VisibilityProvider } from "../providers/VisibilityProvider";
import DataHandler from "../DataHandler";
import ShopInterface from "./ShopInterface";
import { ShopItem } from "../types/ShopItem";

function App() {
	const theme = useMantineTheme();

	DataHandler();

	return (
		<VisibilityProvider>
			<Flex w="100vw" h="100vh" align="center" justify="center">
				<Paper
					w="75vw"
					h="82vh"
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
				Cash: 50.89,
				Bank: 200001.32,
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
				category: "Redwood Wights Pack Long",
				label: "Redwood Wights Pack Long",
				price: 2,
				weight: 100,
				count: 23,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/egochaser.png",
			},
			{
				name: "egochaser",
				category: "Food",
				label: "Ego Chaser",
				price: 2,
				count: 5,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/egochaser.png",
			},
			{
				name: "egochaser",
				category: "Food",
				label: "Ego Chaser",
				price: 2,
				weight: 100,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/egochaser.png",
				license: "weapon",
			},
			{
				name: "egochaser",
				category: "Food",
				label: "Ego Chaser",
				price: 2,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/egochaser.png",
				license: "hunting",
			},
			{
				name: "egochaser",
				category: "Food",
				label: "Ego Chaser",
				price: 2,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/egochaser.png",
			},
			{
				name: "steak",
				category: "Food",
				label: "Steak",
				price: 2,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/steak.png",
			},
			{
				name: "sparkling water",
				category: "Drink",
				label: "Crystal Clear Sparkling Water",
				price: 1,
				weight: 50,
				count: 10,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/sparkling_water.png",
			},
			{
				name: "sports watch",
				category: "Accessory",
				label: "Sports Watch",
				price: 25,
				weight: 200,
				count: 3,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/sports_watch.png",
				license: "accessory",
			},
			{
				name: "gaming mouse",
				category: "Electronics",
				label: "Gaming Mouse",
				price: 35,
				weight: 150,
				count: 5,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/gaming_mouse.png",
			},
			{
				name: "chocolate bar",
				category: "Food",
				label: "Deluxe Chocolate Bar",
				price: 3,
				weight: 95,
				count: 15,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/chocolate_bar.png",
			},
			{
				name: "baseball cap",
				category: "Clothing",
				label: "Baseball Cap",
				price: 15,
				weight: 80,
				count: 20,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/baseball_cap.png",
			},
			{
				name: "artisan coffee",
				category: "Drink",
				label: "Artisan Coffee Beans",
				price: 15,
				weight: 500,
				count: 10,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/artisan_coffee.png",
			},
			{
				name: "vintage sunglasses",
				category: "Accessory",
				label: "Vintage Sunglasses",
				price: 50,
				weight: 100,
				count: 4,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/vintage_sunglasses.png",
			},
			{
				name: "wireless headphones",
				category: "Electronics",
				label: "Wireless Headphones",
				price: 120,
				weight: 250,
				count: 5,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/wireless_headphones.png",
			},
			{
				name: "organic granola bars",
				category: "Food",
				label: "Organic Granola Bars",
				price: 5,
				weight: 50,
				count: 20,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/organic_granola_bars.png",
			},
			{
				name: "running shoes",
				category: "Clothing",
				label: "Running Shoes",
				price: 80,
				weight: 1000,
				count: 10,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/running_shoes.png",
			},
			{
				name: "e-reader",
				category: "Electronics",
				label: "E-Reader",
				price: 130,
				weight: 300,
				count: 7,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/e_reader.png",
			},
			{
				name: "steak",
				category: "Food",
				label: "Steak",
				price: 2,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/steak.png",
			},
			{
				name: "sparkling water",
				category: "Drink",
				label: "Crystal Clear Sparkling Water",
				price: 1,
				weight: 50,
				count: 10,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/sparkling_water.png",
			},
			{
				name: "sports watch",
				category: "Accessory",
				label: "Sports Watch",
				price: 25,
				weight: 200,
				count: 3,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/sports_watch.png",
				license: "accessory",
			},
			{
				name: "gaming mouse",
				category: "Electronics",
				label: "Gaming Mouse",
				price: 35,
				weight: 150,
				count: 5,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/gaming_mouse.png",
			},
			{
				name: "chocolate bar",
				category: "Food",
				label: "Deluxe Chocolate Bar",
				price: 3,
				weight: 95,
				count: 15,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/chocolate_bar.png",
			},
			{
				name: "baseball cap",
				category: "Clothing",
				label: "Baseball Cap",
				price: 15,
				weight: 80,
				count: 20,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/baseball_cap.png",
			},
			{
				name: "artisan coffee",
				category: "Drink",
				label: "Artisan Coffee Beans",
				price: 15,
				weight: 500,
				count: 10,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/artisan_coffee.png",
			},
			{
				name: "vintage sunglasses",
				category: "Accessory",
				label: "Vintage Sunglasses",
				price: 50,
				weight: 100,
				count: 4,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/vintage_sunglasses.png",
			},
			{
				name: "wireless headphones",
				category: "Electronics",
				label: "Wireless Headphones",
				price: 120,
				weight: 250,
				count: 5,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/wireless_headphones.png",
			},
			{
				name: "organic granola bars",
				category: "Food",
				label: "Organic Granola Bars",
				price: 5,
				weight: 50,
				count: 20,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/organic_granola_bars.png",
			},
			{
				name: "running shoes",
				category: "Clothing",
				label: "Running Shoes",
				price: 80,
				weight: 1000,
				count: 10,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/running_shoes.png",
			},
			{
				name: "e-reader",
				category: "Electronics",
				label: "E-Reader",
				price: 130,
				weight: 300,
				count: 7,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/e_reader.png",
			},
			{
				name: "gourmet cheese",
				category: "Food",
				label: "Gourmet Cheese",
				price: 20,
				weight: 200,
				count: 15,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/gourmet_cheese.png",
			},
			{
				name: "smartwatch",
				category: "Electronics",
				label: "Smartwatch",
				price: 199,
				weight: 150,
				count: 6,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/smartwatch.png",
			},
			{
				name: "professional camera",
				category: "Electronics",
				label: "Professional Camera",
				price: 850,
				weight: 1200,
				count: 3,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/professional_camera.png",
			},
			{
				name: "yoga mat",
				category: "Accessory",
				label: "Yoga Mat",
				price: 25,
				weight: 900,
				count: 12,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/yoga_mat.png",
			},
			{
				name: "bluetooth speaker",
				category: "Electronics",
				label: "Bluetooth Speaker",
				price: 60,
				weight: 400,
				count: 8,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/bluetooth_speaker.png",
			},
			{
				name: "backpack",
				category: "Accessory",
				label: "Backpack",
				price: 70,
				weight: 500,
				count: 10,
				imagePath: "https://files.jellyton.me/ShareX/2024/02/backpack.png",
			},
		] as ShopItem[],
	},
]);

export default App;
