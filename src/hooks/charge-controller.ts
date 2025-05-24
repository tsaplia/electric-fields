import { CHARGE_RADIUS } from "@/lib/constants";
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
    const [movingIndex, setMovingIndex] = useState<number | null>(null)

    useEffect(()=>{
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;

        const charceValRadius = scaleX.toValue(CHARGE_RADIUS) - scaleX.toValue(0);
        const getClickedCharge = (x: number, y: number) => {
            for(let i = cs.charges.length - 1; i >= 0; i--) {
                const charge = cs.charges[i];
                if(Math.abs(charge.x - x) < charceValRadius && Math.abs(charge.y - y) < charceValRadius) {
                    return i;
                }
            }
            return null;
        }

        const handleClick = (e: MouseEvent) => {
            if(tool === "select") return;
            const x = scaleX.toValue(e.clientX);
            const y = scaleY.toValue(e.clientY);
            const sign = tool === "electron" ? 1 : -1;

            const index = getClickedCharge(x, y);
            if(index !== null && sign === cs.charges[index].sign) {
                cs.removeCharge(index);
            } else {
                cs.addCharge({sign , x, y });
            }
        };

        const handlePress = (e: TouchEvent|MouseEvent) => {
            if(tool !== "select") {
                setDisabled(true);
                return;
            }
            const point = e instanceof MouseEvent ? e : e.touches[0];
            const index = getClickedCharge(scaleX.toValue(point.clientX), scaleY.toValue(point.clientY));
            if(index === null ) return;
            setDisabled(true);
            setMovingIndex(index);
        }

        const handleMove = (e: TouchEvent|MouseEvent) => {
            if(movingIndex === null || e instanceof MouseEvent && (e.buttons & 1) === 0) return;
            const point = e instanceof MouseEvent ? e : e.touches[0];
            cs.updateCharge(movingIndex, scaleX.toValue(point.clientX), scaleY.toValue(point.clientY));
        }

        const handleUp = () => {
            setMovingIndex(null);
            setDisabled(false);
        }

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
        }
    }, [canvasRef, scaleX, scaleY, tool, cs, setDisabled, movingIndex, setMovingIndex]);
}
