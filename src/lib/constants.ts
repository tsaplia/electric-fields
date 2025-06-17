import type { ConfigState } from "@/stores/config-store";

export const CHARGE_RADIUS = 0.7;
export const CROSS_ERRROR = 1e-7;

type ConfigType = { [K in keyof ConfigState]: { default: ConfigState[K]; min?: number; max?: number } };

export const CONFIGS: ConfigType = {
    charge1: { default: 10, min: -100, max: 100 },
    charge2: { default: 10, min: -100, max: 100 },
    lineCount: { default: 25, min: 1, max: 500 },
    offset: { default: 5, min: 0, max: 360 },
    showForce: { default: true },
    showCharge: { default: true },
    showLines: { default: true },
    lineColor1: { default: "#888877" },
    lineColor2: { default: "#778888" },
    positiveColor: { default: "#0000FF" },
    negativeColor: { default: "#FF0000" },
    stepSize: { default: 7, min: 1, max: 50 },
    bothSides: { default: false },
    maxSteps: { default: 500000, min: 1, max: 500000 },
} as const;

export const INITIAL_CHARGES = [
    { x: 30, y: 50, value: 10 },
    { x: 70, y: 50, value: -20 },
];

export const SCALE_RANGE = { a: 0, b: 100 };
export const SCALING_FACTOR = 1.15;
export const MAX_SCALE = 3;
export const MIN_SCALE = 0.05;
