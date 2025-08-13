import { useState } from "react";
import SidebarToggle from "./sidebar-toggle";
import { cn } from "@/lib/utils";
import SidebarContent from "./sidebar-content";

function Sidebar({ className }: { className?: string }) {
    const [opened, setOpened] = useState(false);
    return (
        <div className={cn("relative", className)}>
            <SidebarContent className="relative z-10" opened={opened} onClose={() => setOpened(false)} />
            <SidebarToggle className="absolute top-2 right-2" onClick={() => setOpened(true)} />
        </div>
    );
}

export default Sidebar;
