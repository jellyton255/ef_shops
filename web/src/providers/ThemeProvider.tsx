import { MantineProvider } from "@mantine/core";

export default function ThemeProvider({ children }) {
	return (
		<MantineProvider
			defaultColorScheme="dark"
			theme={{
				fontFamily: "Inter, sans-serif",
				colors: {
					dark: ["#C1C2C5", "#A6A7AB", "#909296", "#5c5f66", "#373A40", "#2C2E33", "#25262b", "#1A1B1E", "#141517", "#101113"],
				},
			}}>
			{children}
		</MantineProvider>
	);
}

/*
globalStyles: (theme) => ({
	body: {
		backgroundColor: isEnvBrowser() ? theme.colors.dark[7] : "00FFFFFF",
		color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
		lineHeight: theme.lineHeight,
		fontSize: theme.fontSizes.md,
		WebkitFontSmoothing: "antialiased",
		MozOsxFontSmoothing: "grayscale",
	},
	headings: {
		fontFamily: "greycliff-cf",
	},
	html: {
		colorScheme: isEnvBrowser() ? "dark" : "00FFFFFF",
		backgroundColor: isEnvBrowser() ? theme.colors.dark[6] : "00FFFFFF",
	},
}),
*/
