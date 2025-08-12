import { useChargeController } from "@/hooks/charge-controller";
import { useScaleController } from "@/hooks/scale-constroller";
import { draw } from "@/lib/painter";
import { useChargeStore } from "@/stores/charge-store";
import { useConfigStore } from "@/stores/config-store";
import { useScaleStore } from "@/stores/scale-store";
import { useEffect, useRef } from "react";
import { useWindowSize } from "react-use";

function Canvas({ className }: { className?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const intercationRef = useRef<HTMLDivElement>(null);

    const config = useConfigStore();
    const xScale = useScaleStore((state) => state.x);
    const yScale = useScaleStore((state) => state.y);
    const charges = useChargeStore((state) => state.charges);

    const { width, height } = useWindowSize();

    useScaleController(intercationRef);
    useChargeController(intercationRef);

    useEffect(() => {
        console.log(charges);
    }, [charges]);

    useEffect(() => {
        if (!canvasRef.current) return;

        canvasRef.current.width = width;
        canvasRef.current.height = height;
    }, [width, height, canvasRef]);

    useEffect(() => {
        if (!canvasRef.current || xScale.pxRange.b * yScale.pxRange.b === 0) return;
        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;

        const pxCharges = charges.map(({ x, y, value }) => ({ x: xScale.toPixel(x), y: yScale.toPixel(y), value }));

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        draw({ ...config, ctx, charges: pxCharges});
        console.debug("Rerender canvas");
    }, [config, xScale, yScale, charges]);

    return (
        <div className={className}>
            <div className="relative" ref={intercationRef}>
                <canvas ref={canvasRef} data-slot="canvas" className="absolute top-0 left-0 z-[-1]" />
            </div>
        </div>
    );
}

export default Canvas;
