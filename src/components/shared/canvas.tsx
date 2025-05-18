import { useScaleController } from "@/hooks/scale-constroller";
import { FIRST_CORDS, SECOND_CORDS } from "@/lib/constants";
import { draw } from "@/lib/painter";
import { useConfigStore } from "@/stores/config-store";
import { useScaleStore } from "@/stores/scale-store";
import { useEffect, useRef } from "react";
import { useWindowSize } from "react-use";

function Canvas({ className }: { className?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    const config = useConfigStore();
    const xScale = useScaleStore((state) => state.x);
    const yScale = useScaleStore((state) => state.y);

    const { width, height } = useWindowSize();


    useScaleController(canvasRef);

        useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;

        canvas.width = width;
        canvas.height = height;
    }, [width, height, canvasRef]);

    useEffect(() => {
        if (!canvasRef.current) return;

        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
            const a = { x: xScale.toPixel(FIRST_CORDS.x), y: yScale.toPixel(FIRST_CORDS.y) };
            const b = { x: xScale.toPixel(SECOND_CORDS.x), y: yScale.toPixel(SECOND_CORDS.y) };
            draw(ctx, config, a, b);
        }
    }, [config, xScale, yScale]);
    return <canvas ref={canvasRef} data-slot="canvas" className={className || ""} />;
}

export default Canvas;
