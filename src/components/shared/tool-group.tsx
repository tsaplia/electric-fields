import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LucideCircleMinus, LucideCirclePlus, LucideMousePointer2 } from "lucide-react";

function ToolGroup({ className }: { className?: string }) {
    return (
        <ToggleGroup type="single" className={cn("card p-2 gap-2", className)} defaultValue="pointer">
            <ToggleGroupItem className="w-9" value="pointer">
                <LucideMousePointer2 />
            </ToggleGroupItem>
            <ToggleGroupItem className="w-9" value="electron">
                <LucideCirclePlus />
            </ToggleGroupItem>
            <ToggleGroupItem className="w-9" value="proton">
                <LucideCircleMinus />
            </ToggleGroupItem>
        </ToggleGroup>
    );
}

export default ToolGroup;
