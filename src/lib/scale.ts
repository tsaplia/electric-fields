import { MAX_SCALE, MIN_SCALE, SCALE_RANGE } from "./constants";

type Range = { a: number; b: number };

export class Scale {
    readonly pxRange: Range;
    readonly valRange: Range;
    constructor(pxRange: Range, valRange: Range) {
        this.pxRange = pxRange;
        this.valRange = valRange;
    }

    toValue(px: number): number {
        return (
            ((px - this.pxRange.a) / (this.pxRange.b - this.pxRange.a)) * (this.valRange.b - this.valRange.a) +
            this.valRange.a
        );
    }

    toPixel(val: number): number {
        return (
            ((val - this.valRange.a) / (this.valRange.b - this.valRange.a)) * (this.pxRange.b - this.pxRange.a) +
            this.pxRange.a
        );
    }

    scale(scale: number, centerPx: number) {
        const centerVal = this.toValue(centerPx);
        const scalePoint = (point: number, center: number) => (point - center) * scale + center;

        const valRange = {
            a: scalePoint(this.valRange.a, centerVal),
            b: scalePoint(this.valRange.b, centerVal),
        };

        const scaleFactor = (SCALE_RANGE.b - SCALE_RANGE.a) / (valRange.b - valRange.a);
        if (scaleFactor < MIN_SCALE || scaleFactor > MAX_SCALE) return this;
        return new Scale(this.pxRange, valRange);
    }

    move(dPx: number) {
        const dVal = ((this.valRange.b - this.valRange.a) / (this.pxRange.b - this.pxRange.a)) * dPx;
        const valRange = {
            a: this.valRange.a + dVal,
            b: this.valRange.b + dVal,
        };
        return new Scale(this.pxRange, valRange);
    }
}
