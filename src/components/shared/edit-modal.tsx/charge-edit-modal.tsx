import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { DEFAULT_CHARGE_VALUE } from "@/lib/constants";
import { useEffect, useState } from "react";
import { useChargeStore } from "@/stores/charge-store";
import { validateForm, type ValidationError } from "@/lib/charge-validation";
import ColorInput from "./color-input";

function ChargeEditModal() {
    const { charges, removeCharge, updateCharge, addCharge, setModal, modalOpen, activeChargeId } = useChargeStore();

    const [errors, setErrors] = useState<ValidationError[] | null>(null);
    const charge = charges.find((charge) => charge.id === activeChargeId) || null;
    const isEditing = activeChargeId !== null;

    useEffect(() => {
        setErrors(null);
    }, [charge]);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { success, data, errors } = validateForm(new FormData(e.currentTarget));

        if (!success) {
            setErrors(errors);
            return;
        }

        console.log(data);

        if (isEditing) updateCharge(activeChargeId!, data);
        else addCharge(data);

        closeModal();
    };

    const handleDelete = () => {
        if (isEditing) removeCharge(activeChargeId!);
        closeModal();
    };

    const closeModal = () => {
        setModal(false);
        setErrors(null);
    };

    return (
        <Dialog open={modalOpen} onOpenChange={() => closeModal()}>
            <DialogContent className="sm:max-w-md max-h-3/4 overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit Charge" : "Add New Charge"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-6">
                    {errors && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                            {errors.map((err) => (
                                <p>
                                    <span className="font-medium">{err.field}: </span>
                                    {err.message}
                                </p>
                            ))}
                        </div>
                    )}
                    {/* Position */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-medium text-muted-foreground">Properties</h4>
                        <div className="grid grid-cols-2 gap-8">
                            <div className="flex">
                                <Label className="me-4" htmlFor="x">
                                    X
                                </Label>
                                <Input
                                    name="x"
                                    id="x"
                                    type="number"
                                    placeholder="0"
                                    className="w-36"
                                    step="0.1"
                                    defaultValue={charge?.x ?? 0}
                                />
                            </div>
                            <div className="flex">
                                <Label className="me-4" htmlFor="y">
                                    Y
                                </Label>
                                <Input
                                    name="y"
                                    id="y"
                                    type="number"
                                    placeholder="0"
                                    className="w-36"
                                    step="0.1"
                                    defaultValue={charge?.y ?? 0}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-[auto_1fr] gap-y-4">
                            <Label htmlFor="value" className="text-nowrap me-4">
                                Charge Value
                            </Label>
                            <Input
                                name="value"
                                id="value"
                                type="number"
                                placeholder="1"
                                step="0.1"
                                defaultValue={charge?.value ?? DEFAULT_CHARGE_VALUE}
                            />
                            <Label htmlFor="lineRotation" className="text-nowrap me-4">
                                Line Rotation (degrees)
                            </Label>
                            <Input
                                name="lineRotation"
                                id="lineRotation"
                                type="number"
                                placeholder="0"
                                defaultValue={charge?.lineRotation}
                            />
                        </div>
                    </div>

                    <Separator />

                    {/* Colors */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-medium text-muted-foreground">Appearance</h4>
                        <div className="grid grid-cols-2 gap-8">
                            <ColorInput name="chargeColor" label="Charge Color" defaultValue={charge?.chargeColor} />
                            <ColorInput name="lineColor" label="Line Color" defaultValue={charge?.lineColor} />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox name="hideCharge" id="hideCharge" defaultChecked={charge?.hideCharge ?? false} />
                            <Label htmlFor="hideCharge" className="text-sm font-normal">
                                Hide charge
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox name="hideLines" id="hideLines" defaultChecked={charge?.hideLines ?? false} />
                            <Label htmlFor="hideLines" className="text-sm font-normal">
                                Hide field lines
                            </Label>
                        </div>
                    </div>

                    <DialogFooter className="pt-2">
                        {isEditing && (
                            <Button type="button" variant="destructive" onClick={handleDelete}>
                                Delete Charge
                            </Button>
                        )}
                        <Button type="submit" variant="default">
                            {isEditing ? "Update" : "Create"}
                        </Button>
                        <DialogClose asChild>
                            <Button variant="outline" type="button">
                                Discard
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}



export default ChargeEditModal;
