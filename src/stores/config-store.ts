import { create } from "zustand";

export interface ConfigState {
    charge1: number;
    charge2: number;
    lineCount: number;
    offset: number;
    showForce: boolean;
    showCharge: boolean;
    showLines: boolean;
    lineColor1: string;
    lineColor2: string;
    chargeColor1: string;
    chargeColor2: string;
    stepSize: number;
    bothSides: boolean;
}

interface ConfigActions {
    setConfig: <T extends keyof ConfigState>(config: T, value: ConfigState[T]) => void;
}

export const useConfigStore = create<ConfigState & ConfigActions>()((set) => ({
    charge1: 10,
    charge2: 10,
    lineCount: 20,
    offset: 4,
    showForce: true,
    showCharge: true,
    showLines: true,
    lineColor1: "#888877",
    lineColor2: "#778888",
    chargeColor1: "#0000FF",
    chargeColor2: "#FF0000",
    stepSize: 5,
    bothSides: false,
    setConfig: (config, value) => set(() => ({ [config]: value })),
}));
