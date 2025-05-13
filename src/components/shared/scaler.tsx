import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { LucidePlus, LucideMinus } from "lucide-react";

function Scaler({ className }: { className?: string }) {
    return (
        <div className={cn("flex flex-col gap-2", className)}>
            <Button variant={"outline"} size={"icon"}>
                <LucidePlus />
            </Button>
            <Button variant={"outline"} size={"icon"}>
                <LucideMinus />
            </Button>
        </div>
    );
}

export default Scaler;
