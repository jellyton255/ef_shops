import React from "react";
import { createRoot } from "react-dom/client";
import { isEnvBrowser } from "./utils/misc";
import App from "./components/App";
import ThemeProvider from "./providers/ThemeProvider";
import { Notifications } from "@mantine/notifications";
import { fetchNui } from "./utils/fetchNui";
import "./index.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "non.geist";

if (!isEnvBrowser()) fetchNui("Loaded");
if (isEnvBrowser()) {
	const root = document.getElementById("root");
	root!.style.backgroundImage = 'url("https://files.jellyton.me/ShareX/2024/01/FiveM_b2802_GTAProcess_-_January15_-_22.12_-_3046.png")';
	root!.style.backgroundSize = "cover";
	root!.style.backgroundRepeat = "no-repeat";
	root!.style.backgroundPosition = "center";
}

const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);
root.render(
	<React.StrictMode>
		<ThemeProvider>
			<Notifications />
			<App />
		</ThemeProvider>
	</React.StrictMode>
);
