import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LucideCircleMinus, LucideCirclePlus, LucideMousePointer2 } from "lucide-react";
import { useToolStore } from "@/stores/charge-store";

function ToolGroup({ className }: { className?: string }) {
    const setTool = useToolStore((state) => state.setTool);
    return (
        <ToggleGroup type="single" className={cn("card p-2 gap-2", className)} defaultValue="select">
            <ToggleGroupItem className="w-9" value="select" onClick={() => setTool("select")}>
                <LucideMousePointer2 />
            </ToggleGroupItem>
            <ToggleGroupItem className="w-9" value="electron" onClick={() => setTool("electron")}>
                <LucideCirclePlus />
            </ToggleGroupItem>
            <ToggleGroupItem className="w-9" value="proton" onClick={() => setTool("proton")}>
                <LucideCircleMinus />
            </ToggleGroupItem>
        </ToggleGroup>
    );
}

export default ToolGroup;
