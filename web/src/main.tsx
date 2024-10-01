import React from "react";
import { createRoot } from "react-dom/client";
import { isEnvBrowser } from "./utils/misc";
import App from "./components/App";
import { fetchNui } from "./utils/fetchNui";
import { Toaster } from "@/components/ui/sonner";
import "./index.css";

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
		<div className="dark">
			<App />
			<Toaster richColors /> {/* disable rich colors if light mode */}
		</div>
	</React.StrictMode>,
);
