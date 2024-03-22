import { create } from "zustand";

type Money = {
	Cash: number | null;
	Bank: number | null;
};

type SelfData = {
	Weight: number | null;
	MaxWeight: number | null;
	Money: Money;
	Licenses: Record<string, boolean> | null;
	setSelfData: (config: { weight?: number; maxWeight?: number; money?: Money; licenses?: Record<string, boolean> }) => void;
};

export const useStoreSelf = create<SelfData>((set) => ({
	// Initial State
	Weight: null,
	MaxWeight: null,
	Money: {
		Cash: null,
		Bank: null,
	},
	Licenses: null,

	// Methods for manipulating state
	setSelfData: (config) => {
		if (config.weight) {
			set(() => ({
				Weight: config.weight,
			}));
		}

		if (config.maxWeight) {
			set(() => ({
				MaxWeight: config.maxWeight,
			}));
		}

		if (config.money) {
			set(() => ({
				Money: config.money,
			}));
		}

		if (config.licenses) {
			set(() => ({
				Licenses: config.licenses,
			}));
		}
	},
}));
