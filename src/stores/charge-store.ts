import { INITIAL_CHARGES } from "@/lib/constants";
import type { Charge } from "@/types";
import { create } from "zustand";

type ChargeStore = {
    charges: Charge[];
    addCharge: (charge: Charge) => void;
    updateCharge: (id: number, data: Partial<Charge>) => void;
    removeCharge: (id: number) => void;
};

export const useChargeStore = create<ChargeStore>()((set, get) => ({
    charges: INITIAL_CHARGES,
    addCharge: (charge: Charge) => {
        set((state) => {
            charge.id = state.charges.at(-1)?.id || 0;
            return { charges: [...state.charges, charge] };
        });
    },
    updateCharge: (id: number, data: Partial<Charge>) => {
        const charges = [...get().charges];
        const index = charges.findIndex((charge) => charge.id === id)!;
        charges[index] = { ...charges[index], ...data };
        set({ charges });
    },
    removeCharge(id: number) {
        const charges = [...get().charges];
        const index = charges.findIndex((charge) => charge.id === id)!;
        charges.splice(index, 1);
        set({ charges });
    },
}));
