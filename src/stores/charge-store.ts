import { INITIAL_CHARGES } from "@/lib/constants";
import type { Charge } from "@/types";
import { create } from "zustand";

type ChargeStore = {
    charges: Charge[];
    activeChargeId: number | null;
    modalOpen: boolean;
    addCharge: (charge: Charge) => void;
    updateCharge: (id: number, data: Partial<Charge>) => void;
    removeCharge: (id: number) => void;
    setActive: (id: number | null) => void;
    openModal: (id: number | null) => void;
    closeModal: () => void;
};

export const useChargeStore = create<ChargeStore>()((set, get) => ({
    charges: INITIAL_CHARGES,
    activeChargeId: null,
    modalOpen: false,
    addCharge: (charge: Charge) => {
        set((state) => {
            charge.id = state.charges.length ? state.charges.at(-1)!.id! + 1 : 0;
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
    setActive(id: number | null) {
        set({ activeChargeId: id });
    },
    openModal(id: number | null) {
        set({ modalOpen: true, activeChargeId: id });
    },
    closeModal() {
        set({modalOpen: false});
    },
}));
