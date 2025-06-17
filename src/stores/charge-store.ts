import { INITIAL_CHARGES } from "@/lib/constants";
import type { Charge } from "@/lib/types";
import { create } from "zustand";

type ChargeStore = {
    charges: Charge[];
    addCharge: (charge: Charge) => void;
    updateCharge: (index: number, x: number, y: number) => void;
    removeCharge: (index: number) => void;
};

export const useChargeStore = create<ChargeStore>()((set, get) => ({
    charges: INITIAL_CHARGES,
    tool: "pointer",
    addCharge: (charge: Charge) => {
        set((state) => ({ charges: [...state.charges, charge] }));
    },
    updateCharge: (index: number, x: number, y: number) => {
        const charges = [...get().charges];
        charges[index] = { value: charges[index].value, x, y };
        set({ charges });
    },
    removeCharge(index: number) {
        const charges = [...get().charges];
        if (index === null) return;
        charges.splice(index, 1);
        set({ charges });
    },
}));

type Tool = "select" | "proton" | "electron";

type ToolStore = {
    tool: Tool;
    setTool: (tool: Tool) => void;
};

export const useToolStore = create<ToolStore>()((set) => ({
    tool: "select",
    setTool: (tool: Tool) => set({ tool }),
}));
