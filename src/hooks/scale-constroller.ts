import { useEffect } from "react";
import { useLatest, useWindowSize } from "react-use";
import { SCALE_RANGE, SCALING_FACTOR } from "@/lib/constants";
import { useScaleStore } from "@/stores/scale-store";
import { Scale } from "@/lib/scale";
import type { Point } from "@/lib/math";

export function useScaleController(canvasRef: React.RefObject<HTMLDivElement | null>) {
    const setXScale = useScaleStore((state) => state.setX);
    const setYScale = useScaleStore((state) => state.setY);
    const disabled = useScaleStore((state) => state.disabled);
    const xScaleRef = useLatest(useScaleStore((state) => state.x));
    const yScaleRef = useLatest(useScaleStore((state) => state.y));

    const { width, height } = useWindowSize();

    useEffect(() => {
        setXScale(new Scale({ a: 0, b: width }, SCALE_RANGE));
        setYScale(new Scale({ a: 0, b: height }, SCALE_RANGE));
    }, [height, width, setXScale, setYScale]);

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const handleWheel = (e: WheelEvent) => {
            if (disabled) return;
            e.preventDefault();
            const scaling = e.deltaY > 0 ? SCALING_FACTOR : 1 / SCALING_FACTOR;
            setXScale(xScaleRef.current.scale(scaling, e.clientX));
            setYScale(yScaleRef.current.scale(scaling, e.clientY));
        };

        let last: Point | null = null;
        const handleDown = (e: MouseEvent | TouchEvent) => {
            e.preventDefault();
            const point = e instanceof MouseEvent ? e : e.touches[0];
            last = { x: point.clientX, y: point.clientY };
        };

        const handleMove = (e: MouseEvent | TouchEvent) => {
            if (!last || disabled || (e instanceof MouseEvent && (e.buttons & 1) === 0)) return;
            e.preventDefault();
            const point = e instanceof MouseEvent ? e : e.touches[0];
            setXScale(xScaleRef.current.move(last.x - point.clientX));
            setYScale(yScaleRef.current.move(last.y - point.clientY));
            last = { x: point.clientX, y: point.clientY };
        };

        const handleUp = () => (last = null);

        canvas.addEventListener("wheel", handleWheel, { passive: false });
        canvas.addEventListener("mousedown", handleDown);
        canvas.addEventListener("mousemove", handleMove);
        canvas.addEventListener("touchstart", handleDown);
        canvas.addEventListener("touchmove", handleMove);
        canvas.addEventListener("touchend", handleUp);
        return () => {
            canvas.removeEventListener("wheel", handleWheel);
            canvas.removeEventListener("mousedown", handleDown);
            canvas.removeEventListener("mousemove", handleMove);
            canvas.removeEventListener("touchstart", handleDown);
            canvas.removeEventListener("touchmove", handleMove);
            canvas.removeEventListener("touchend", handleUp);
        };
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canvasRef, setXScale, setYScale, disabled]);
}
