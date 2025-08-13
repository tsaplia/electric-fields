import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ColorInputProps {
    name: string;
    defaultValue?: string;
    label: string;
}

function ColorInput({ name, defaultValue, label }: ColorInputProps) {
    const [show, setShow] = useState<boolean>(!!defaultValue);
    const [value, setValue] = useState<string>(defaultValue || "#000000");

    return (
        <div className="flex items-center space-x-2">
            <Checkbox id={name+"-check"} checked={show} onCheckedChange={(checked) => setShow(checked as boolean)} />
            <Label htmlFor={name} className={cn("me-4", show ? "" : "text-muted-foreground")}>
                {label}
            </Label>
            <Input
                id={name}
                type="color"
                className="w-9 px-1"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                disabled={!show}
            />
            {/* Hidden input to send the actual form value */}
            <input type="hidden" name={name} value={show ? value : ""} />
        </div>
    );
}

export default ColorInput;
