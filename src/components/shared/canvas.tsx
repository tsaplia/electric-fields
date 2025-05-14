import { draw } from "@/lib/painter";
import { useConfigStore } from "@/stores/config-store";
import { useEffect, useRef } from "react";
import { useWindowSize } from "react-use";

function Canvas({ className }: { className?: string }) {
    const config = useConfigStore();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { width, height } = useWindowSize();
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
            draw(ctx, config); 
        }
    }, [config, width, height]);
    return <canvas ref={canvasRef} data-slot="canvas" className={className || ""} />;
}

export default Canvas;
