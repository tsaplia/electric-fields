import { CONFIGS } from "@/lib/constants";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ConfigActions {
    setConfig: <T extends keyof ConfigState>(config: T, value: ConfigState[T]) => void;
}

export type ConfigState = {
    charge1: number;
    charge2: number;
    lineCount: number;
    offset: number;
    showForce: boolean;
    showCharge: boolean;
    showLines: boolean;
    lineColor1: string;
    lineColor2: string;
    positiveColor: string;
    negativeColor: string;
    stepSize: number;
    maxSteps: number;
    bothSides: boolean;
};

const defaultState = {} as { [key: string]: ConfigState[keyof ConfigState] };
for (const key in CONFIGS) {
    defaultState[key] = CONFIGS[key as keyof ConfigState].default;
}

export const useConfigStore = create<ConfigState & ConfigActions>()(
    persist(
        (set, get) => ({
            ...(defaultState as ConfigState),

            setConfig: (config, value) => {
                const cur = get()[config];
                if (cur !== value) set(() => ({ [config]: value }));
            },
        }),
        {
            name: "config-store",
        }
    )
);
