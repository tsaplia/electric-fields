import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useChargeStore } from "@/stores/charge-store";
import { useConfigStore } from "@/stores/config-store";
import type { Charge } from "@/types";
import { LucideEdit3, LucideEye, LucideEyeOff, LucideTrash } from "lucide-react";
import { useEffect } from "react";

type Props = {
    charge: Charge;
};

function ChargeInfo({ charge }: Props) {
    const positiveColor = useConfigStore((state) => state.positiveColor);
    const negativeColor = useConfigStore((state) => state.negativeColor);
    const updateCharge = useChargeStore((state) => state.updateCharge);
    const removeCharge = useChargeStore((state) => state.removeCharge);
    useEffect(() => {
        console.log("charge rerender", charge.id);
    }, [charge]);

    function toggleVisibility() {
        if (charge.hideCharge || charge.hideCharge) updateCharge(charge.id!, { hideCharge: false, hideLines: false });
        else updateCharge(charge.id!, { hideCharge: true, hideLines: true });
    }

    return (
        <div className="flex items-center gap-2 p-2 rounded-md border bg-transporent">
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span
                        className={cn("font-mono font-medium text-base")}
                        style={{ color: charge.chargeColor || charge.value > 0 ? positiveColor : negativeColor }}
                    >
                        {charge.value > 0 ? "+" : ""}
                        {charge.value}
                    </span>
                    <span className="text-secondary-foreground">
                        ({charge.x}, {charge.y})
                    </span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                    {charge.hideCharge && (
                        <span className="text-xs text-muted-foreground bg-muted px-1 rounded">charge hidden</span>
                    )}
                    {charge.hideLines && (
                        <span className="text-xs text-muted-foreground bg-muted px-1 rounded">lines hidden</span>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-1">
                <Button
                    size="sm"
                    variant="plain"
                    className="h-6 w-6 p-2 text-foreground/30 hover:text-foreground"
                    onClick={toggleVisibility}
                >
                    {charge.hideCharge || charge.hideLines ? (
                        <LucideEyeOff className="h-3 w-3" />
                    ) : (
                        <LucideEye className="h-3 w-3" />
                    )}
                </Button>
                <Button size="sm" variant="plain" className="h-6 w-6 p-2 text-foreground/30 hover:text-foreground">
                    <LucideEdit3 className="h-3 w-3" />
                </Button>
                <Button
                    size="sm"
                    variant="plain"
                    className="h-6 w-6 p-2 text-destructive/40 hover:text-destructive"
                    onClick={() => removeCharge(charge.id!)}
                >
                    <LucideTrash className="h-3 w-3" />
                </Button>
            </div>
        </div>
    );
}

export default ChargeInfo;
