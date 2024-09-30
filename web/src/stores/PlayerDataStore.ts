import { create } from "zustand";

type Money = {
	Cash: number;
	Bank: number;
};

type Job = {
	name: string;
	grade: number;
};

type SelfData = {
	Weight: number;
	MaxWeight: number;
	Money: Money;
	Job: Job;
	Licenses: Record<string, boolean> | null;
	setSelfData: (config: { weight?: number; maxWeight?: number; money?: Money; licenses?: Record<string, boolean>; job: Job }) => void;
};

export const useStoreSelf = create<SelfData>((set) => ({
	// Initial State
	Weight: null,
	MaxWeight: null,
	Money: {
		Cash: null,
		Bank: null,
	},
	Job: {
		name: null,
		grade: null,
	},
	Licenses: null,

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

		if (config.job) {
			set(() => ({
				Job: config.job,
			}));
		}

		if (config.licenses) {
			set(() => ({
				Licenses: config.licenses,
			}));
		}
	},
}));
