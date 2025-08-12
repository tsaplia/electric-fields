import { CONFIGS } from "@/lib/constants";
import { create } from "zustand";

interface ConfigActions {
    setConfig: <T extends keyof ConfigState>(config: T, value: ConfigState[T]) => void;
}

export type ConfigState = {
    // Appearance
    positiveColor: string;
    negativeColor: string;
    hideAllCharges: boolean;
    hideAllLines: boolean;
    hideNegativeLines: boolean;
    hidePositiveLines: boolean;
    chargeDisplayRadius: number;
    hideGrid: boolean;

    // Dev options
    stepSize: number;
    maxSteps: number;
};

const defaultState = {} as { [key: string]: ConfigState[keyof ConfigState] };
for (const key in CONFIGS) {
    defaultState[key] = CONFIGS[key as keyof ConfigState].default;
}

export const useConfigStore = create<ConfigState & ConfigActions>()((set, get) => ({
    ...(defaultState as ConfigState),

    setConfig: (config, value) => {
        const cur = get()[config];
        if (cur !== value) set(() => ({ [config]: value }));
    },
}));
