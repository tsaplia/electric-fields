import { CHARGE_DETECTION_RADIUS } from "@/lib/constants";
import { closestIndex, distance } from "@/lib/math";
import { useChargeStore } from "@/stores/charge-store";
import { useScaleStore } from "@/stores/scale-store";
import { useToolStore } from "@/stores/tool-store";
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
            const dist = cs.charges[ci] ? distance({ x, y }, cs.charges[ci]) : Infinity;
            if (dist < CHARGE_DETECTION_RADIUS && sign * cs.charges[ci].value > 0) {
                cs.removeCharge(cs.charges[ci].id!);
            } else if (dist > 2 * CHARGE_DETECTION_RADIUS) {
                console.log("ADD", dist, cs.charges[ci]);
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
            if (cs.charges[ci] && distance(cs.charges[ci], point) <= CHARGE_DETECTION_RADIUS) {
                setDisabled(true);
                setMovingIndex(ci);
            }
        };

        const handleMove = (e: TouchEvent | MouseEvent) => {
            if (movingIndex === null || (e instanceof MouseEvent && (e.buttons & 1) === 0)) return;
            const pointPx = e instanceof MouseEvent ? e : e.touches[0];
            const point = { x: scaleX.toValue(pointPx.clientX), y: scaleY.toValue(pointPx.clientY) };
            const ci = closestIndex(point, [...cs.charges.slice(0, movingIndex), ...cs.charges.slice(movingIndex + 1)]);
            if (!cs.charges[ci] || distance(cs.charges[ci], point) > 2 * CHARGE_DETECTION_RADIUS) {
                console.log("MOVE", distance(cs.charges[ci], point), cs.charges[ci]);
                cs.updateCharge(cs.charges[ci].id!, point);
            }
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
