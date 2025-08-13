import type { Charge } from "@/types";
import { z } from "zod";

export const chargeFormSchema = z.object({
    x: z
        .string()
        .min(1, "X coordinate is required")
        .transform((val) => parseFloat(val))
        .refine((val) => !isNaN(val), "X must be a valid number")
        .refine((val) => val >= -1000 && val <= 1000, "X must be between -1000 and 1000"),

    y: z
        .string()
        .min(1, "Y coordinate is required")
        .transform((val) => parseFloat(val))
        .refine((val) => !isNaN(val), "Y must be a valid number")
        .refine((val) => val >= -1000 && val <= 1000, "Y must be between -1000 and 1000"),

    value: z
        .string()
        .min(1, "Charge value is required")
        .transform((val) => parseFloat(val))
        .refine((val) => !isNaN(val), "Charge value must be a valid number")
        .refine((val) => val !== 0, "Charge value cannot be zero")
        .refine((val) => Math.abs(val) <= 250, "Charge value must be between -250 and 250"),
    lineRotation: z
        .string()
        .optional()
        .transform((val) => (val === "" || val === undefined ? undefined : parseFloat(val)))
        .refine((val) => val === undefined || !isNaN(val), "Line rotation must be a valid number")
        .refine((val) => val === undefined || (val >= 0 && val <= 360), "Line rotation must be between 0 and 360 degrees"),
    chargeColor: z
        .string()
        .optional()
        .refine((val) => !val || /^#[0-9A-F]{6}$/i.test(val), "Charge color must be a valid hex color")
        .transform((val) => (val === "#000000" ? undefined : val)),

    lineColor: z
        .string()
        .optional()
        .refine((val) => !val || /^#[0-9A-F]{6}$/i.test(val), "Line color must be a valid hex color")
        .transform((val) => (val === "#000000" ? undefined : val)),

    hideCharge: z
        .string()
        .nullable()
        .optional()
        .transform((val) => val === "on"),

    hideLines: z
        .string()
        .nullable()
        .optional()
        .transform((val) => val === "on"),
});

export type ChargeFormData = z.infer<typeof chargeFormSchema>;

export const formDataToObject = (formData: FormData) => {
    return {
        x: formData.get("x") as string,
        y: formData.get("y") as string,
        value: formData.get("value") as string,
        lineRotation: formData.get("lineRotation") as string,
        chargeColor: formData.get("chargeColor") as string,
        lineColor: formData.get("lineColor") as string,
        hideCharge: formData.get("hideCharge") as string,
        hideLines: formData.get("hideLines") as string,
    };
};

export type ValidationError = { field: "general" | keyof Charge; message: string };

const removeUndefined = <T extends Record<string, unknown>>(obj: T) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return Object.fromEntries(Object.entries(obj).filter(([_, value]) => value !== undefined)) as Partial<T>;
};

export const validateForm = (formData: FormData) => {
    try {
        const formObject = formDataToObject(formData);
        const validatedData = chargeFormSchema.parse(formObject);
        return { success: true as const, data: removeUndefined(validatedData) as ChargeFormData };
    } catch (error) {
        if (!(error instanceof z.ZodError)) {
            return {
                success: false as const,
                data: null,
                errors: [{ field: "general", message: "Validation Error" }] as ValidationError[],
            };
        }
        const formErrors = error.errors.map((err) => ({ field: err.path[0], message: err.message }));

        return {
            success: false as const,
            data: null,
            errors: formErrors as ValidationError[],
        };
    }
};
