import { CHARGE_RADIUS } from "@/lib/constants";
import { closestIndex, distance } from "@/lib/math";
import { useChargeStore, useToolStore } from "@/stores/charge-store";
import { useScaleStore } from "@/stores/scale-store";
import { useEffect, useState } from "react";

export function useChargeController(canvasRef: React.RefObject<HTMLDivElement | null>) {
    // TODO: dont rerun effect when charges change
    const scaleX = useScaleStore((state) => state.x);
    const scaleY = useScaleStore((state) => state.y);
    const setDisabled = useScaleStore((state) => state.setDisabled);
    const tool = useToolStore((state) => state.tool);
    const cs = useChargeStore((state) => state);
    const [movingIndex, setMovingIndex] = useState<number | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;

        const handleClick = (e: MouseEvent) => {
            if (tool === "select") return;
            const x = scaleX.toValue(e.clientX);
            const y = scaleY.toValue(e.clientY);
            const sign = tool === "electron" ? 1 : -1;

            const ci = closestIndex({ x, y }, cs.charges);
            if (cs.charges[ci] && distance(cs.charges[ci], { x, y }) < CHARGE_RADIUS && sign * cs.charges[ci].value > 0) {
                cs.removeCharge(ci);
            } else {
                cs.addCharge({ value: sign * 10, x, y });
            }
        };

        const handlePress = (e: TouchEvent | MouseEvent) => {
            if (tool !== "select") {
                setDisabled(true);
                return;
            }
            const pointPx = e instanceof MouseEvent ? e : e.touches[0];
            const point = { x: scaleX.toValue(pointPx.clientX), y: scaleY.toValue(pointPx.clientY) };
            const ci = closestIndex(point, cs.charges);
            if (cs.charges[ci] && distance(cs.charges[ci], point) <= CHARGE_RADIUS) {
                setDisabled(true);
                setMovingIndex(ci);
            }
        };

        const handleMove = (e: TouchEvent | MouseEvent) => {
            if (movingIndex === null || (e instanceof MouseEvent && (e.buttons & 1) === 0)) return;
            const point = e instanceof MouseEvent ? e : e.touches[0];
            cs.updateCharge(movingIndex, scaleX.toValue(point.clientX), scaleY.toValue(point.clientY));
        };

        const handleUp = () => {
            setMovingIndex(null);
            setDisabled(false);
        };

        canvas.addEventListener("touchstart", handlePress);
        canvas.addEventListener("touchmove", handleMove);
        canvas.addEventListener("touchend", handleUp);
        canvas.addEventListener("mousedown", handlePress);
        canvas.addEventListener("mousemove", handleMove);
        canvas.addEventListener("mouseup", handleUp);
        canvas.addEventListener("click", handleClick);
        return () => {
            canvas.removeEventListener("click", handleClick);
            canvas.removeEventListener("touchstart", handlePress);
            canvas.removeEventListener("touchmove", handleMove);
            canvas.removeEventListener("touchend", handleUp);
            canvas.removeEventListener("mousedown", handlePress);
            canvas.removeEventListener("mousemove", handleMove);
            canvas.removeEventListener("mouseup", handleUp);
        };
    }, [canvasRef, scaleX, scaleY, tool, cs, setDisabled, movingIndex, setMovingIndex]);
}
