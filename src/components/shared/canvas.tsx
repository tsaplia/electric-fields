import { draw } from "@/lib/painter";
import { useConfigStore } from "@/stores/config-store";
import { useEffect, useRef } from "react";

function Canvas({ className }: { className?: string }) {
    const config = useConfigStore();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
            draw(ctx, config);
        }
    }, [config]);
    return <canvas ref={canvasRef} data-slot="canvas" className={className || ""} />;
}

export default Canvas;
