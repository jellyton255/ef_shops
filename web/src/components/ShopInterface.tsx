import { Text, Stack, Title, Grid, Skeleton, Group, NumberFormatter, Badge, CloseButton, Flex } from "@mantine/core";
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

	return (
		<Title order={1} ml={20}>
			{CurrentShop?.label}
		</Title>
	);
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
		<Group h="fit-content" gap={6}>
			<Badge size="xl" leftSection={<FontAwesomeIcon size="xl" icon={faMoneyBill1Wave} />} color="green" radius="sm" variant="light">
				<Text fz={20} fw={700} ta="right" mx={6} lh={1}>
					<NumberFormatter prefix="$" value={Money.Cash} thousandSeparator decimalScale={0} />
				</Text>
			</Badge>
			<Badge size="xl" leftSection={<FontAwesomeIcon size="xl" icon={faCreditCard} />} color="blue" radius="sm" variant="light">
				<Text fz={20} fw={700} ta="right" mx={6} lh={1}>
					<NumberFormatter prefix="$" value={Money.Bank} thousandSeparator decimalScale={0} />
				</Text>
			</Badge>
		</Group>
	);
}

function ShopInterface() {
	return (
		<Stack w="100%" h="100%">
			<Group h="auto" w="100%" justify="space-between">
				<ShopTitle />
				<Group>
					<PlayerData />
					<CloseButton
						size="xl"
						onClick={() => {
							if (!isEnvBrowser()) fetchNui("hideFrame");
						}}
					/>
				</Group>
			</Group>
			<Grid
				w="100%"
				h={0}
				my="auto"
				mx="auto"
				columns={18}
				style={{ flexGrow: 1 }}
				styles={{
					inner: { height: "100%" },
				}}>
				<Grid.Col span={13} h="100%">
					<ShopGrid />
				</Grid.Col>
				<Grid.Col span={5} h="100%">
					<Cart />
				</Grid.Col>
			</Grid>
		</Stack>
	);
}

export default ShopInterface;
