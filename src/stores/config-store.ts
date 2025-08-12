import { CONFIGS } from "@/lib/constants";
import type { ConfigsType } from "@/types";
import { create } from "zustand";

interface ConfigActions {
    setConfig: <T extends keyof ConfigsType>(config: T, value: ConfigsType[T]) => void;
}

const defaultState = {} as { [key: string]: ConfigsType[keyof ConfigsType] };
for (const key in CONFIGS) {
    defaultState[key] = CONFIGS[key as keyof ConfigsType].default;
}

export const useConfigStore = create<ConfigsType & ConfigActions>()((set, get) => ({
    ...(defaultState as ConfigsType),

    setConfig: (config, value) => {
        const cur = get()[config];
        if (cur !== value) set(() => ({ [config]: value }));
    },
}));
