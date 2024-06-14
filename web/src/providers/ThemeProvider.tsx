import { MantineProvider } from "@mantine/core";

export default function ThemeProvider({ children }) {
	return (
		<MantineProvider
			defaultColorScheme="dark"
			theme={{
				fontFamily: "Geist Variable",
				colors: {
					dark: ["#C1C2C5", "#A6A7AB", "#909296", "#5c5f66", "#373A40", "#2C2E33", "#25262b", "#1A1B1E", "#141517", "#101113"],
				},
			}}>
			{children}
		</MantineProvider>
	);
}
