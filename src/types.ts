export type Charge = {
    id?: number;
    x: number;
    y: number;
    value: number;
    lineRotation?: number;
    hideLines?: boolean;
    hideCharge?: boolean;
    lineColor?: string;
    chargeColor?: string;
};

export type ConfigsType = {
    // Appearance
    positiveColor: string;
    negativeColor: string;
    hideAllCharges: boolean;
    hideAllLines: boolean;
    hideNegativeLines: boolean;
    hidePositiveLines: boolean;
    chargeDisplayRadius: number;
    hideGrid: boolean;

    // Dev options
    stepSize: number;
    maxSteps: number;
};
