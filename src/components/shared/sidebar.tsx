import { cn } from "@/lib/utils";
import { LucideMinimize2, LucideSettings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

function Sidebar({ className }: { className?: string }) {
    return (
        <aside className={cn("h-full w-80 card px-9 py-6", className)}>
            <div className="flex items-center pb-5 text-secondary-foreground">
                <h2 className="text-2xl text-neutral-800 font-semibold tracking-tight first:mt-0 mr-auto">
                    Settings
                </h2>
                <Button className="-mr-2" variant={"ghost"} size={"icon"}>
                    <LucideMinimize2 />
                </Button>
            </div>
            <Accordion type="multiple" className="w-full" defaultValue={["general"]}>
                <AccordionItem value="general">
                    <AccordionTrigger className="font-normal">General</AccordionTrigger>
                    <AccordionContent>
                        <label htmlFor="charge-1">First charge</label>
                        <Input id="charge-1" type="number" />
                        <label htmlFor="charge-2">Second charge</label>
                        <Input id="charge-2" type="number" />
                        <label htmlFor="line-count">Line Count</label>
                        <Input id="line-count" type="number" />
                        <label htmlFor="first-offset">First line offset</label>
                        <Input name="offset-grad" type="number" />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="appearance">
                    <AccordionTrigger>Appearance</AccordionTrigger>
                    <AccordionContent>
                        <div className="flex gap-2 items-center">
                            <Checkbox id="show-charges" />
                            <label htmlFor="show-charges">Field lines</label>
                        </div>
                        <div className="flex">
                            <Input
                                className="w-9 p-1 place-self-auto"
                                name="field-color"
                                type="color"
                            />
                        </div>
                        <div className="flex gap-2 items-center col-span-2">
                            <Checkbox id="forces" />
                            <label htmlFor="forces">Forces</label>
                        </div>
                        <div className="flex gap-2 items-center">
                            <Checkbox id="show-charges" />
                            <label htmlFor="show-charges">Charges</label>
                        </div>
                        <div className="flex gap-2">
                            <Input className="w-9 p-1 place-self-auto" type="color" />
                            <Input className="w-9 p-1 place-self-auto" type="color" />
                        </div>
                        <label htmlFor="radius">Charge radius</label>
                        <Input id="radius" type="number" />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="techinical">
                    <AccordionTrigger>Techinical</AccordionTrigger>
                    <AccordionContent>
                        <label className="input-label" htmlFor="step">
                            Step size
                        </label>
                        <Input name="step" type="number" />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </aside>
    );
}

function SidebarToggle({ className }: { className?: string }) {
    return (
        <div className={cn("p-2 inline-block", className)}>
            <Button variant={"secondary"} size={"icon"}>
                <LucideSettings />
            </Button>
        </div>
    );
}

export { Sidebar, SidebarToggle };
