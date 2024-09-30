import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react()],
	base: "./",
	build: {
		outDir: "build",
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes("node_modules/.pnpm/")) {
						// Extracting the module name for PNPM structure
						const splitId = id.split("node_modules/.pnpm/")[1];
						const moduleName = splitId.includes("/") ? splitId.split("/")[0] : splitId;

						// Define partial names to target for separate chunking
						const targetedPartials = ["lodash", "moment", "fortawesome", "mantine", "tabler"];

						// Find the first partial that matches the module name
						const matchingPartial = targetedPartials.find((partial) => moduleName.includes(partial));

						if (matchingPartial) {
							// Return the partial name as the chunk name
							return matchingPartial;
						}
						// Grouping other dependencies into a common chunk
						return "vendor";
					}
				},
			},
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
