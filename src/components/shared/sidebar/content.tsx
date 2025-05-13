import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckConfigInput, ConfigInput } from "./config-inputs";
import { Button } from "@/components/ui/button";
import { LucideMinimize2 } from "lucide-react";

type Props = {
    className?: string;
    opened: boolean;
    onClose: () => void;
};

function SidebarContent({ className, opened, onClose }: Props) {
    return (
        <aside
            className={cn(
                "h-full card py-4 transition-all duration-300 overflow-hidden",
                opened ? "w-80 px-6" : "w-0 px-0 border-0",
                className
            )}
        >
            <div className="flex items-center pb-5 text-secondary-foreground">
                <h2 className="text-2xl text-neutral-800 font-semibold tracking-tight first:mt-0 mr-auto">
                    Settings
                </h2>
                <Button className="-mr-2" variant={"ghost"} size={"icon"} onClick={onClose}>
                    <LucideMinimize2 />
                </Button>
            </div>
            <Accordion type="multiple" className="w-full" defaultValue={["general"]}>
                <AccordionItem value="general">
                    <AccordionTrigger className="font-normal">General</AccordionTrigger>
                    <AccordionContent>
                        <ConfigInput type="number" configName="charge1" label="First charge"></ConfigInput>
                        <ConfigInput type="number" configName="charge2" label="Second charge"></ConfigInput>
                        <ConfigInput type="number" configName="lineCount" label="Line Count"></ConfigInput>
                        <ConfigInput
                            type="number"
                            configName="offset"
                            label="First line offset"
                        ></ConfigInput>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="appearance">
                    <AccordionTrigger>Appearance</AccordionTrigger>
                    <AccordionContent>
                        <CheckConfigInput configName="showLines" label="Field lines" />
                        <div className="flex gap-2">
                            <ConfigInput type="color" configName="lineColor1"></ConfigInput>
                            <ConfigInput type="color" configName="lineColor2"></ConfigInput>
                        </div>
                        <CheckConfigInput configName="showCharge" label="Charges" />
                        <div className="flex gap-2">
                            <ConfigInput type="color" configName="chargeColor1"></ConfigInput>
                            <ConfigInput type="color" configName="chargeColor2"></ConfigInput>
                        </div>
                        <CheckConfigInput className="col-span-2" configName="showForce" label="Forces" />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="techinical">
                    <AccordionTrigger>Techinical</AccordionTrigger>
                    <AccordionContent>
                        <ConfigInput type="number" configName="stepSize" label="Step size" />
                        <CheckConfigInput
                            className="col-span-2"
                            configName="bothSides"
                            label="Paint from both sides"
                        />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </aside>
    );
}

export default SidebarContent;
