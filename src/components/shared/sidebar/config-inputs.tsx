import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CONFIGS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useConfigStore, type ConfigState } from "@/stores/config-store";
import { useState } from "react";
import { useDebounce } from "react-use";

type CheckInputProps = {
    configName: keyof ConfigState;
    label: string;
    className?: string;
    disabled?: boolean
};

export function CheckConfigInput({ configName, className, label, disabled }: CheckInputProps) {
    const value = useConfigStore((state) => state[configName]);
    const setConfig = useConfigStore((state) => state.setConfig);
    return (
        <div className={cn("flex gap-2 items-center", className)}>
            <Checkbox id={configName} onCheckedChange={() => setConfig(configName, !value)} checked={!!value} disabled={disabled}/>
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
            if (value === "") return;
            const typedValue = type === "number" ? +value : value;
            setConfig(configName, typedValue);
        },
        200,
        [value]
    );

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        if(type === "color" || e.target.value === "") return setValue(e.target.value);
        const newValue = +e.target.value;
        if(newValue >= CONFIGS[configName].min! && newValue <= CONFIGS[configName].max!) {
            setValue(e.target.value);
        }
    }

    return (
        <>
            {label && <Label htmlFor={configName}>{label}</Label>}
            <Input
                className={type === "color" ? "w-9 p-1 place-self-auto" : ""}
                min={CONFIGS[configName].min}
                max={CONFIGS[configName].max}
                id={configName}
                type={type}
                value={value}
                onChange={handleChange}
                onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
                onBlur={() => {if(value === "") setValue(configValue + "")}}
            />
        </>
    );
}
