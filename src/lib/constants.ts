import type { ConfigState } from "@/stores/config-store";

export const CHARGE_RADIUS = 10;
export const CROSS_ERRROR = 1e-9;

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
    chargeColor1: { default: "#0000FF" },
    chargeColor2: { default: "#FF0000" },
    stepSize: { default: 5, min: 1, max: 100 },
    bothSides: { default: false },
    maxSteps: { default: 500000, min: 1, max: 500000 },
} as const;

export const SCALE_RANGE = { a: 0, b: 10 };
export const FIRST_CORDS = { x: 3, y: 5 } as const;
export const SECOND_CORDS = { x: 7, y: 5 } as const;
export const SCALING_FACTOR = 1.25;
