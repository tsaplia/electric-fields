import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { LucidePlus, LucideMinus } from "lucide-react";
import { useScaleStore } from "@/stores/scale-store";
import { useLatest } from "react-use";
import { SCALING_FACTOR } from "@/lib/constants";


//TODO: add reset button
function Scaler({ className }: { className?: string }) {
    const setXScale = useScaleStore((state) => state.setX);
    const setYScale = useScaleStore((state) => state.setY);
    const xScaleRef = useLatest(useScaleStore((state) => state.x));
    const yScaleRef = useLatest(useScaleStore((state) => state.y));

    const zoom = (scaling: number) => {
        setXScale(xScaleRef.current.scale(scaling, xScaleRef.current.pxRange.b / 2));
        setYScale(yScaleRef.current.scale(scaling, yScaleRef.current.pxRange.b / 2));
    };
    return (
        <div className={cn("flex flex-col gap-2", className)}>
            <Button variant={"outline"} size={"icon"} onClick={() => zoom(1 / SCALING_FACTOR)}>
                <LucidePlus />
            </Button>
            <Button variant={"outline"} size={"icon"} onClick={() => zoom(SCALING_FACTOR)}>
                <LucideMinus />
            </Button>
        </div>
    );
}

export default Scaler;
