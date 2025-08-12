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
                "h-full card py-4 transition-all duration-300 overflow-hidden",
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
                    <AccordionContent>
                        <ConfigInput type="number" configName="chargeDisplayRadius" label="Charge display radius" />
                        <div className="w-full col-span-2 grid grid-cols-2 gap-2">
                            <div className="flex gap-2">
                                <ConfigInput type="color" configName="positiveColor" label="Positive"></ConfigInput>
                            </div>
                            <div className="flex gap-2">
                                <ConfigInput type="color" configName="negativeColor" label="Negative"></ConfigInput>
                            </div>
                        </div>
                        <CheckConfigInput className="col-span-2" configName="hideGrid" label="Hide grid" />
                        <CheckConfigInput className="col-span-2" configName="hideAllCharges" label="Hide all charges" />
                        <CheckConfigInput className="col-span-2" configName="hideAllLines" label="Hide all lines" />
                        <CheckConfigInput
                            className="col-span-2"
                            configName="hideNegativeLines"
                            label="Hide negative lines"
                            disabled={hideAllLines}
                        />
                        <CheckConfigInput
                            className="col-span-2"
                            configName="hidePositiveLines"
                            label="Hide positive lines"
                            disabled={hideAllLines}
                        />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="dev">
                    <AccordionTrigger>Dev Options</AccordionTrigger>
                    <AccordionContent>
                        <ConfigInput type="number" configName="stepSize" label="Step size" />
                        <ConfigInput type="number" configName="maxSteps" label="Max steps" />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </aside>
    );
}

export default SidebarContent;
