import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useConfigStore, type ConfigState } from "@/stores/config-store";
import { useState } from "react";
import { useDebounce } from "react-use";

type CheckInputProps = {
    configName: keyof ConfigState;
    label: string;
    className?: string;
};

export function CheckConfigInput({ configName, className, label }: CheckInputProps) {
    const value = useConfigStore((state) => state[configName]);
    const setConfig = useConfigStore((state) => state.setConfig);
    return (
        <div className={cn("flex gap-2 items-center", className)}>
            <Checkbox
                id={configName}
                onCheckedChange={() => setConfig(configName, !value)}
                checked={!!value}
            />
            <Label htmlFor={configName}>{label}</Label>
        </div>
    );
}

type ConfigInputProps = {
    configName: keyof ConfigState;
    label?: string;
    type: "number" | "color";
};

export function ConfigInput({ configName, label, type }: ConfigInputProps) {
    const configValue = useConfigStore((state) => state[configName]);
    const setConfig = useConfigStore((state) => state.setConfig);
    const [value, setValue] = useState(configValue + "");

    useDebounce(
        () => {
            const typedValue = type === "number" ? +value : value;
            setConfig(configName, typedValue);
        },
        200,
        [value]
    );

    return (
        <>
            {label && <Label htmlFor={configName}>{label}</Label>}
            <Input
                className={type === "color" ? "w-9 p-1 place-self-auto" : ""}
                id={configName}
                type={type}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
            />
        </>
    );
}
