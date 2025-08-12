import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckConfigInput, ConfigInput } from "./config-inputs";
import { Button } from "@/components/ui/button";
import { LucideMinimize2 } from "lucide-react";
import { useConfigStore } from "@/stores/config-store";

type Props = {
    className?: string;
    opened: boolean;
    onClose: () => void;
};

function SidebarContent({ className, opened, onClose }: Props) {
    const hideAllLines = useConfigStore((state) => state.hideAllLines);
    return (
        <aside
            className={cn(
                "h-full card py-4 transition-all duration-300 overflow-auto",
                opened ? "w-80 px-6" : "w-0 px-0 border-0",
                className
            )}
        >
            <div className="flex items-center pb-5 text-secondary-foreground">
                <h2 className="text-2xl text-neutral-800 font-semibold tracking-tight first:mt-0 mr-auto">Settings</h2>
                <Button className="-mr-2" variant={"ghost"} size={"icon"} onClick={onClose}>
                    <LucideMinimize2 />
                </Button>
            </div>
            <Accordion type="multiple" className="w-full" defaultValue={["appearance"]}>
                <AccordionItem value="appearance">
                    <AccordionTrigger>Appearance</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-2">
                        <ConfigInput
                            type="number"
                            configName="chargeDisplayRadius"
                            label="Charge display radius"
                            className="justify-between"
                        />
                        <div className="grid grid-cols-2 gap-2">
                            <ConfigInput type="color" configName="positiveColor" label="Positive"></ConfigInput>
                            <ConfigInput type="color" configName="negativeColor" label="Negative"></ConfigInput>
                        </div>
                        <CheckConfigInput configName="hideGrid" label="Hide grid" />
                        <CheckConfigInput configName="hideAllCharges" label="Hide all charges" />
                        <CheckConfigInput configName="hideAllLines" label="Hide all lines" />
                        <CheckConfigInput
                            configName="hideNegativeLines"
                            label="Hide negative lines"
                            disabled={hideAllLines}
                        />
                        <CheckConfigInput
                            configName="hidePositiveLines"
                            label="Hide positive lines"
                            disabled={hideAllLines}
                        />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="dev">
                    <AccordionTrigger>Dev Options</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-2">
                        <ConfigInput type="number" configName="stepSize" label="Step size" className="justify-between" />
                        <ConfigInput type="number" configName="maxSteps" label="Max steps" className="justify-between" />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </aside>
    );
}

export default SidebarContent;
