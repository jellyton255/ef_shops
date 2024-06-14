import { Text, Stack, Title, Grid, Group, NumberFormatter, Badge, CloseButton, Flex } from "@mantine/core";
import { fetchNui } from "../utils/fetchNui";
import { useStoreShop } from "../stores/ShopStore";
import { useStoreSelf } from "../stores/PlayerDataStore";
import { faCreditCard, faMoneyBill1Wave, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cart from "./Cart";
import ShopGrid from "./ShopGrid";
import { isEnvBrowser } from "../utils/misc";
import { Skeleton } from "./ui/skeleton";

function ShopTitle() {
	const { CurrentShop } = useStoreShop();

	if (!CurrentShop)
		return (
			<div className="my-auto ml-6 flex h-full w-1/6 flex-col gap-2">
				<Skeleton className="h-1/4 w-full rounded-full" />
				<Skeleton className="h-1/4 w-2/3 rounded-full" />
				<Skeleton className="h-1/4 w-2/3 rounded-full" />
			</div>
		);

	return <h1 className="ml-6 text-4xl font-bold">{CurrentShop?.label}</h1>;
}

function PlayerData() {
	const { Money } = useStoreSelf();

	if (!PlayerData) return null;

	return (
		<div className="flex gap-2">
			<p className="flex items-center gap-2 rounded-md bg-green-700/50 px-5 py-1 text-lg font-bold leading-none text-green-300">
				<FontAwesomeIcon size="xl" icon={faMoneyBill1Wave} />
				<NumberFormatter prefix="$" value={Money.Cash} thousandSeparator decimalScale={0} />
			</p>
			<p className="flex items-center gap-2 rounded-md bg-blue-600/30 px-5 py-1 text-lg font-bold leading-none text-blue-300">
				<FontAwesomeIcon size="xl" icon={faCreditCard} />
				<NumberFormatter prefix="$" value={Money.Bank} thousandSeparator decimalScale={0} />
			</p>
		</div>
	);
}

export default function ShopInterface() {
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
				columns={18}
				style={{ flexGrow: 1 }}
				styles={{
					inner: { height: "102%" },
				}}
			>
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
