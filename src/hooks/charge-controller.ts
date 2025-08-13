import { CHARGE_DETECTION_RADIUS, DEFAULT_CHARGE_VALUE } from "@/lib/constants";
import { closestPoint, distance, type Point } from "@/lib/math";
import { useChargeStore } from "@/stores/charge-store";
import { useScaleStore } from "@/stores/scale-store";
import { useToolStore } from "@/stores/tool-store";
import { useCallback, useEffect, useRef, useState } from "react";

function roundPoint(point: Point) {
    return {
        x: +point.x.toFixed(1),
        y: +point.y.toFixed(1),
    };
}

export function useChargeController(canvasRef: React.RefObject<HTMLDivElement | null>) {
    const scaleX = useScaleStore((state) => state.x);
    const scaleY = useScaleStore((state) => state.y);
    const setDisabled = useScaleStore((state) => state.setDisabled);
    const tool = useToolStore((state) => state.tool);
    const { charges, updateCharge, addCharge, setActive, openModal } = useChargeStore((state) => state);
    const [movingIndex, setMovingIndex] = useState<number | null>(null);
    const chargesRef = useRef(charges);

    useEffect(() => {
        chargesRef.current = charges;
    }, [charges]);

    const getPointFromEvent = useCallback(
        (e: MouseEvent | TouchEvent): Point => {
            const clientEvent = e instanceof MouseEvent ? e : e.touches[0];
            return {
                x: scaleX.toValue(clientEvent.clientX),
                y: scaleY.toValue(clientEvent.clientY),
            };
        },
        [scaleX, scaleY]
    );

    const handleClick = useCallback(
        (e: MouseEvent) => {
            const point = getPointFromEvent(e);

            const closest = closestPoint(point, chargesRef.current);
            const dist = closest ? distance(point, closest) : Infinity;

            if (tool === "select") {
                if (closest && dist < CHARGE_DETECTION_RADIUS) setActive(closest.id!);
                else setActive(null);
            } else if (dist > CHARGE_DETECTION_RADIUS) {
                const sign = tool === "electron" ? 1 : -1;
                addCharge({ value: sign * DEFAULT_CHARGE_VALUE, ...roundPoint(point) });
            }
        },
        [getPointFromEvent, tool, setActive, addCharge]
    );

    const handleDblclick = useCallback(
        (e: MouseEvent) => {
            if (tool !== "select") return;
            const point = getPointFromEvent(e);
            const closest = closestPoint(point, chargesRef.current);
            const dist = closest ? distance(point, closest) : Infinity;
            if (closest && dist < CHARGE_DETECTION_RADIUS) openModal(closest.id!);
        },
        [tool, getPointFromEvent, openModal]
    );

    const handlePress = useCallback(
        (e: TouchEvent | MouseEvent) => {
            if (tool !== "select") {
                setDisabled(true);
                return;
            }
            const point = getPointFromEvent(e);
            const closest = closestPoint(point, chargesRef.current);
            if (closest && distance(closest, point) <= CHARGE_DETECTION_RADIUS) {
                setDisabled(true);
                setMovingIndex(closest.id!);
                setActive(closest.id!);
            }
        },
        [tool, getPointFromEvent, setDisabled, setActive]
    );

    const handleMove = useCallback(
        (e: TouchEvent | MouseEvent) => {
            if (movingIndex === null || (e instanceof MouseEvent && (e.buttons & 1) === 0)) return;
            const point = getPointFromEvent(e);
            const closest = closestPoint(point, [
                ...chargesRef.current.slice(0, movingIndex),
                ...chargesRef.current.slice(movingIndex + 1),
            ]);
            if (!closest || distance(closest, point) > 2 * CHARGE_DETECTION_RADIUS) {
                updateCharge(movingIndex, roundPoint(point));
            }
        },
        [movingIndex, getPointFromEvent, updateCharge]
    );

    const handleUp = useCallback(() => {
        setMovingIndex(null);
        setDisabled(false);
    }, [setDisabled, setMovingIndex]);

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;

        canvas.addEventListener("touchstart", handlePress);
        canvas.addEventListener("touchmove", handleMove);
        canvas.addEventListener("touchend", handleUp);
        canvas.addEventListener("mousedown", handlePress);
        canvas.addEventListener("mousemove", handleMove);
        canvas.addEventListener("mouseup", handleUp);
        canvas.addEventListener("click", handleClick);
        canvas.addEventListener("dblclick", handleDblclick);
        return () => {
            canvas.removeEventListener("click", handleClick);
            canvas.removeEventListener("touchstart", handlePress);
            canvas.removeEventListener("touchmove", handleMove);
            canvas.removeEventListener("touchend", handleUp);
            canvas.removeEventListener("mousedown", handlePress);
            canvas.removeEventListener("mousemove", handleMove);
            canvas.removeEventListener("mouseup", handleUp);
            canvas.removeEventListener("dblclick", handleDblclick);
        };
    }, [canvasRef, handleClick, handleDblclick, handleMove, handlePress, handleUp]);
}
