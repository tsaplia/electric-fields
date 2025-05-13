import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideSettings } from "lucide-react";

function SidebarToggle({ className, ...props }: { className?: string } & React.ComponentProps<"button">) {
    return (
        <div className={cn("py-2 inline-block", className)}>
            <Button variant={"secondary"} size={"icon"} {...props}>
                <LucideSettings />
            </Button>
        </div>
    );
}

export default SidebarToggle;
