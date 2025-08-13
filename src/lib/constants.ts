import type { ConfigsType } from "@/types";

export const CHARGE_DETECTION_RADIUS = 0.7;
export const CROSS_ERRROR = 1e-7;

type ConfigType = { [K in keyof ConfigsType]: { default: ConfigsType[K]; min?: number; max?: number } };

export const CONFIGS: ConfigType = {
    // Appearance
    positiveColor: { default: "#EF4444" },
    negativeColor: { default: "#3B82F6" },
    hideAllCharges: { default: false },
    hideAllLines: { default: false },
    hidePositiveLines: { default: false },
    hideNegativeLines: { default: true },
    chargeDisplayRadius: { default: 6, min: 1, max: 20 },
    hideGrid: { default: false },

    // Dev options
    stepSize: { default: 7, min: 1, max: 50 },
    maxSteps: { default: 500000, min: 1, max: 500000 },
} as const;

export const DEFAULT_CHARGE_VALUE = 18;

export const INITIAL_CHARGES = [
    { id: 0, x: 30, y: 50, value: DEFAULT_CHARGE_VALUE },
    { id: 1, x: 70, y: 50, value: -DEFAULT_CHARGE_VALUE },
];

export const SCALE_RANGE = { a: 0, b: 100 };
export const SCALING_FACTOR = 1.15;
export const MAX_SCALE = 3;
export const MIN_SCALE = 0.05;
