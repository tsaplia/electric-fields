import { SCALE_RANGE } from "@/lib/constants";
import { Scale } from "@/lib/scale";
import { create } from "zustand";

type ScaleStore = {
    x: Scale;
    y: Scale;
    disabled: boolean;
    setX: (scale: Scale) => void;
    setY: (scale: Scale) => void;
    setDisabled: (disabled: boolean) => void;
};

export const useScaleStore = create<ScaleStore>()((set) => ({
    x: new Scale({ a: 0, b: 0 }, SCALE_RANGE),
    y: new Scale({ a: 0, b: 0 }, SCALE_RANGE),
    disabled: false,
    setX: (scale: Scale) => set({ x: scale }),
    setY: (scale: Scale) => set({ y: scale }),
    setDisabled: (disabled: boolean) => set({ disabled }),
}));
