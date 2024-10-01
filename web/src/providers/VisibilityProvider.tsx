import React, { Context, createContext, useContext, useEffect, useState } from "react";
import { useNuiEvent } from "../hooks/useNuiEvent";
import { fetchNui } from "../utils/fetchNui";
import { isEnvBrowser } from "../utils/misc";
import { motion } from "framer-motion";

const VisibilityCtx = createContext<VisibilityProviderValue | null>(null);

interface VisibilityProviderValue {
	setVisible: (visible: boolean) => void;
	visible: boolean;
}

export const VisibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [visible, setVisible] = useState(false);

	useNuiEvent<boolean>("setVisible", setVisible);

	// Handle pressing escape/backspace
	useEffect(() => {
		// Only attach listener when we are visible
		if (!visible) return;

		const keyHandler = (e: KeyboardEvent) => {
			if (["Escape"].includes(e.code)) {
				if (!isEnvBrowser()) fetchNui("hideFrame");
				else setVisible(!visible);
			}
		};

		window.addEventListener("keydown", keyHandler);

		return () => window.removeEventListener("keydown", keyHandler);
	}, [visible]);

	return (
		<VisibilityCtx.Provider
			value={{
				visible,
				setVisible,
			}}
		>
			<motion.div
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.8 }}
				transition={{ duration: 0.2, ease: "easeInOut" }}
				style={{ height: "100%" }}
			>
				{children}
			</motion.div>
		</VisibilityCtx.Provider>
	);
};

export const useVisibility = () => useContext<VisibilityProviderValue>(VisibilityCtx as Context<VisibilityProviderValue>);
