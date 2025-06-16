import { useChargeController } from "@/hooks/charge-controller";
import { useScaleController } from "@/hooks/scale-constroller";
import { FIRST_CORDS, SECOND_CORDS } from "@/lib/constants";
import { draw, drawCharges } from "@/lib/painter";
import { useChargeStore } from "@/stores/charge-store";
import { useConfigStore } from "@/stores/config-store";
import { useScaleStore } from "@/stores/scale-store";
import { useEffect, useRef } from "react";
import { useWindowSize } from "react-use";

function Canvas({ className }: { className?: string }) {
    const chargeCanvasRef = useRef<HTMLCanvasElement>(null);
    const fieldCanvasRef = useRef<HTMLCanvasElement>(null);
    const intercationRef = useRef<HTMLDivElement>(null);

    const config = useConfigStore();
    const xScale = useScaleStore((state) => state.x);
    const yScale = useScaleStore((state) => state.y);
    const charges = useChargeStore((state) => state.charges);

    const { width, height } = useWindowSize();

    useScaleController(intercationRef);
    useChargeController(intercationRef);

    useEffect(() => {
        if (!chargeCanvasRef.current || !fieldCanvasRef.current) return;

        fieldCanvasRef.current.width = width;
        fieldCanvasRef.current.height = height;
        chargeCanvasRef.current.width = width;
        chargeCanvasRef.current.height = height;
    }, [width, height, chargeCanvasRef, fieldCanvasRef]);

    useEffect(() => {
        if (!fieldCanvasRef.current || xScale.pxRange.b * yScale.pxRange.b === 0) return;

        const ctx = fieldCanvasRef.current.getContext("2d");
        if (ctx) {
            const a = { x: xScale.toPixel(FIRST_CORDS.x), y: yScale.toPixel(FIRST_CORDS.y), value: config.charge1 };
            const b = { x: xScale.toPixel(SECOND_CORDS.x), y: yScale.toPixel(SECOND_CORDS.y), value: config.charge2 };
            draw({ ...config, ctx, a, b });
        }
        console.debug("render field");
    }, [config, xScale, yScale]);

    useEffect(() => {
        if (!chargeCanvasRef.current || xScale.pxRange.b * yScale.pxRange.b === 0) return;
        const ctx = chargeCanvasRef.current.getContext("2d");
        if (ctx) {
            const a = { x: xScale.toPixel(FIRST_CORDS.x), y: yScale.toPixel(FIRST_CORDS.y), value: config.charge1 };
            const b = { x: xScale.toPixel(SECOND_CORDS.x), y: yScale.toPixel(SECOND_CORDS.y), value: config.charge2 };
            const pxCharges = charges.map(({ x, y, value }) => ({ x: xScale.toPixel(x), y: yScale.toPixel(y), value }));
            drawCharges({ ...config, ctx, charges: pxCharges, a, b });
        }
        console.debug("render charges");
    }, [charges, config, xScale, yScale]);

    return (
        <div className={className}>
            <div className="relative" ref={intercationRef}>
                <canvas ref={fieldCanvasRef} data-slot="canvas" className="absolute top-0 left-0 z-[-1]" />
                <canvas ref={chargeCanvasRef} data-slot="canvas" className="absolute top-0 left-0 z-[-1]" />
            </div>
        </div>
    );
}

export default Canvas;
