import { Text, Stack, Title, Grid, Button, Skeleton, Group, NumberFormatter, Badge, Tooltip, CloseButton } from "@mantine/core";
import { useState } from "react";
import { fetchNui } from "../utils/fetchNui";
import { useStoreShop } from "../stores/ShopStore";
import { useStoreSelf } from "../stores/PlayerDataStore";
import { faCreditCard, faMoneyBill1Wave } from "@fortawesome/free-solid-svg-icons";
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

function ShopInterface() {
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
				</Grid.Col>
			</Grid>
		</Stack>
	);
}

export default ShopInterface;
