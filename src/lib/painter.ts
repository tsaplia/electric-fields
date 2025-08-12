import type { ConfigState } from "@/stores/config-store";
import { CROSS_ERRROR } from "./constants";
import { closestIndex, distance, Vector, type Point } from "./math";
import type { Charge } from "./types";

type Rect = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
};

interface DrawConfig extends ConfigState {
    ctx: CanvasRenderingContext2D;
    charges: Charge[];
}

function isInRect(point: Point, rect: Rect) {
    return point.x >= rect.x1 && point.x <= rect.x2 && point.y >= rect.y1 && point.y <= rect.y2;
}

function getPaintRect({ charges, ctx }: DrawConfig): Rect {
    const { width, height } = ctx.canvas;
    const x1 = Math.min(...charges.map((c) => c.x), 0);
    const y1 = Math.min(...charges.map((c) => c.y), 0);
    const x2 = Math.max(...charges.map((c) => c.x), width);
    const y2 = Math.max(...charges.map((c) => c.y), height);
    return { x1, y1, x2, y2 };
}

function getStepSize(normForce: number) {
    return 1 / normForce;
}

function calcForce(main: Charge, charges: Charge[]) {
    const vectors = charges.map((c) => new Vector(main.x - c.x, main.y - c.y));
    const forces = charges.map((charge, i) => (charge.value * main.value) / Math.pow(vectors[i].length, 2));
    let resForceVec = new Vector(0, 0);
    for (let i = 0; i < charges.length; i++) {
        resForceVec = resForceVec.add(vectors[i].scale(forces[i]));
    }
    return { resForceVec, forces };
}

function getRK4Step({ x, y }: Point, h: number, func: (x: number, y: number) => Vector) {
    /* func should return normalised vector */
    const k1 = func(x, y);
    const k2 = func(x + (h / 2) * k1.x, y + (h / 2) * k1.y);
    const k3 = func(x + (h / 2) * k2.x, y + (h / 2) * k2.y);
    const k4 = func(x + h * k3.x, y + h * k3.y);
    return new Vector((h / 6) * (k1.x + 2 * k2.x + 2 * k3.x + k4.x), (h / 6) * (k1.y + 2 * k2.y + 2 * k3.y + k4.y));
}

function drawCharge(charge: Charge, { ctx, positiveColor, negativeColor, chargeDisplayRadius }: DrawConfig) {
    ctx.fillStyle = charge.value > 0 ? positiveColor : negativeColor;
    ctx.strokeStyle = "#000000";

    ctx.beginPath();
    ctx.arc(charge.x, charge.y, chargeDisplayRadius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    const size = chargeDisplayRadius * 0.5;
    if (charge.value != 0) {
        ctx.beginPath();
        ctx.moveTo(charge.x - size, charge.y);
        ctx.lineTo(charge.x + size, charge.y);
        ctx.stroke();
    }
    if (charge.value > 0) {
        ctx.beginPath();
        ctx.moveTo(charge.x, charge.y - size);
        ctx.lineTo(charge.x, charge.y + size);
        ctx.stroke();
    }
}

/* check if new vector is "closer" to the -end vector */
function crossCheck({ x, y }: Point, points: Point[], change: Vector, prevChange: Vector) {
    if (points.length === 0) return false;
    let mxCross = -Infinity;
    for (const charge of points) {
        const vecEnd = new Vector(x - charge.x, y - charge.y);
        const crossMult = prevChange.cross(change) * prevChange.cross(vecEnd.scale(change.length)); // shouls be negative
        mxCross = Math.max(mxCross, crossMult);
    }
    return mxCross < -CROSS_ERRROR;
}

function calcChange(cur: Point, start: Charge, charges: Charge[], cfg: DrawConfig) {
    const { resForceVec, forces } = calcForce({ ...cur, value: 1 }, [start, ...charges]);
    const normForce = resForceVec.mult(1 / Math.sqrt(Math.abs(forces[0] * forces[1])));

    let stepSize = Math.max(cfg.stepSize, getStepSize(normForce.length));
    if (isInRect(cur, { x1: 0, y1: 0, x2: cfg.ctx.canvas.width, y2: cfg.ctx.canvas.height })) {
        stepSize = cfg.stepSize;
    }

    return getRK4Step(cur, stepSize, (x, y) => {
        const scale = start.value > 0 ? 1 : -1;
        return calcForce({ x, y, value: 1 }, [start, ...charges]).resForceVec.scale(scale);
    });
}

function drawFieldLine(angle: Point, start: Charge, charges: Charge[], color: string, cfg: DrawConfig) {
    const { ctx } = cfg;
    if (start.value == 0) return 0;

    ctx.beginPath();
    ctx.moveTo(start.x, start.y);

    let x = angle.x + start.x;
    let y = angle.y + start.y;
    let steps = 0;
    let prevRes: Vector | null = null;
    while (steps < cfg.maxSteps) {
        /* check if we reached a charge */
        const ci = closestIndex({ x, y }, charges);
        if (charges[ci] && distance({ x, y }, charges[ci]) <= cfg.stepSize && charges[ci].value !== 0) {
            if (isInRect({ x, y }, getPaintRect(cfg))) ctx.lineTo(charges[ci].x, charges[ci].y);
            break;
        }

        const change = calcChange({ x, y }, start, charges, cfg);

        if (isInRect({ x, y }, getPaintRect(cfg))) {
            ctx.lineTo(x + change.x, y + change.y);
        } else if (isInRect({ x: x + change.x, y: y + change.y }, getPaintRect(cfg))) {
            ctx.moveTo(x, y);
            ctx.lineTo(x + change.x, y + change.y);
        }
        if (change.isNull()) break;

        // check if new vector is "closer" to the -end vector
        if (!isInRect({ x, y }, getPaintRect(cfg)) && prevRes && !crossCheck({ x, y }, charges, change, prevRes)) {
            break;
        }

        x += change.x;
        y += change.y;
        prevRes = change;
        steps++;
    }
    ctx.strokeStyle = color;
    ctx.stroke();
    return steps;
}

function drawField(cfg: DrawConfig) {
    if (!cfg.charges.length) return;

    cfg.charges.forEach((start, ind) => {
        const startVecs: Vector[] = [];
        startVecs.push(new Vector(0, cfg.stepSize).rotate(1 * (Math.PI / 180))); // TODO: change
        for (let i = 1; i < Math.abs(start.value); i++) {
            startVecs.push(startVecs[i - 1].rotate((2 * Math.PI) / Math.abs(start.value)));
        }

        const results: number[] = [];
        for (const vec of startVecs) {
            if ((start.value > 0 && cfg.hidePositiveLines) || (start.value < 0 && cfg.hideNegativeLines)) continue;
            const color = start.value > 0 ? cfg.positiveColor : cfg.negativeColor;
            const other = cfg.charges.filter((c) => c !== start);
            const steps = drawFieldLine(vec, start, other, color, cfg);
            results.push(steps);
        }
        const maxStepCnt = results.reduce((prev, curr) => (curr === cfg.maxSteps ? prev + 1 : prev), 0);
        const maximalStep = results.reduce((prev, curr) => (curr === cfg.maxSteps ? prev : Math.max(prev, curr)), 0);
        const sum = results.reduce((prev, curr) => prev + curr, 0);
        console.debug(`${ind} - maxStepCnt: ${maxStepCnt}, maximalStep: ${maximalStep}, sum: ${sum}`);
    });
}

export function draw(cfg: DrawConfig) {
    const { ctx } = cfg;
    if (!cfg.hideAllLines) {
        ctx.lineWidth = 1;
        drawField(cfg);
    }

    if (!cfg.hideAllCharges) {
        ctx.lineWidth = cfg.chargeDisplayRadius * 0.15;
        ctx.lineCap = "round";
        cfg.charges.forEach((charge) => drawCharge(charge, cfg));
    }
}
