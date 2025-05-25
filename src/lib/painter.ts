import type { ConfigState } from "@/stores/config-store";
import { CHARGE_RADIUS, CROSS_ERRROR, SMALL_CHARGE_RADIUS } from "./constants";
import { Vector, type Point } from "./math";
import type { Charge } from "./types";

type Rect = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
};

interface DrawConfig extends ConfigState {
    ctx: CanvasRenderingContext2D;
    a: Charge;
    b: Charge;
}

interface DrawChargesConfig extends DrawConfig {
    charges: Charge[];
}

function isInRect(point: Point, rect: Rect) {
    return point.x >= rect.x1 && point.x <= rect.x2 && point.y >= rect.y1 && point.y <= rect.y2;
}

function getPaintRect({ a, b, ctx }: DrawConfig): Rect {
    const { width, height } = ctx.canvas;
    return {
        x1: Math.min(a.x, b.x, 0),
        y1: Math.min(a.y, b.y, 0),
        x2: Math.max(a.x, b.x, width),
        y2: Math.max(a.y, b.y, height),
    };
}

function getStepSize(normForce: number, dist: number) {
    return ((1 / normForce) * dist) / 20;
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

function drawCharge(charge: Charge, radius: number, { ctx, positiveColor, negativeColor }: DrawConfig) {
    ctx.fillStyle = charge.value > 0 ? positiveColor : charge.value < 0 ? negativeColor : "#FFFFFF";
    ctx.strokeStyle = "#000000";

    ctx.beginPath();
    ctx.arc(charge.x, charge.y, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    const size = radius * 0.5;
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

function drawForces(main: Charge, charges: Charge[]) {
    const { resForceVec, forces } = calcForce(main, charges);
    console.log(resForceVec.length, forces);
}

function drawFieldLine(angle: Point, start: Charge, end: Charge, color: string, cfg: DrawConfig) {
    const { ctx } = cfg;
    const dist = new Vector(end.x - start.x, end.y - start.y).length;
    console.log(dist)

    if (start.value == 0) return 0;
    if (start.value < 0) {
        start.value = -start.value;
        end.value = -end.value;
    }

    ctx.beginPath();
    ctx.moveTo(start.x, start.y);

    let x = angle.x + start.x;
    let y = angle.y + start.y;
    let steps = 0;
    let prevRes: Vector | null = null;
    while (steps < cfg.maxSteps) {
        const vecEnd = new Vector(x - end.x, y - end.y);
        if (vecEnd.length <= CHARGE_RADIUS && end.value !== 0) break;

        const { resForceVec, forces } = calcForce({ x, y, value: 1 }, [start, end]);
        const normForce = resForceVec.mult(1 / Math.sqrt(Math.abs(forces[0] * forces[1])));

        let stepSize = Math.max(cfg.stepSize, getStepSize(normForce.length, dist));
        if (isInRect({ x, y }, { x1: 0, y1: 0, x2: ctx.canvas.width, y2: ctx.canvas.height })) {
            stepSize = cfg.stepSize;
        }

        const change = getRK4Step({ x, y }, stepSize, (_x, _y) => {
            return calcForce({ x: _x, y: _y, value: 1 }, [start, end]).resForceVec.scale(1);
        });

        if (isInRect({ x, y }, getPaintRect(cfg))) {
            ctx.lineTo(x + change.x, y + change.y);
        } else if (isInRect({ x: x + change.x, y: y + change.y }, getPaintRect(cfg))) {
            ctx.moveTo(x, y);
            ctx.lineTo(x + change.x, y + change.y);
        }
        if (change.isNull()) break;

        // check if new vector is "closer" to the -end vector
        if (!isInRect({ x, y }, getPaintRect(cfg)) && prevRes) {
            const crossMult = prevRes.cross(change) * prevRes.cross(vecEnd.scale(stepSize));
            if (crossMult >= -CROSS_ERRROR) break; // the new vector and the vector from end are in the same direction
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
    const startVecs: Vector[] = [];
    startVecs.push(new Vector(0, cfg.stepSize).rotate(cfg.offset * (Math.PI / 180)));
    for (let i = 1; i < cfg.lineCount; i++) {
        startVecs.push(startVecs[i - 1].rotate((2 * Math.PI) / cfg.lineCount));
    }

    const results: number[] = [];
    for (const vec of startVecs) {
        let steps = drawFieldLine(vec, cfg.a, cfg.b, cfg.lineColor1, cfg);
        results.push(steps);

        if (cfg.charge1 * cfg.charge2 < 0 && !cfg.bothSides) continue;
        steps = drawFieldLine({ x: -vec.x, y: vec.y }, cfg.b, cfg.a, cfg.lineColor2, cfg);
        results.push(steps);
    }
    const maxStepCnt = results.reduce((prev, curr) => (curr === cfg.maxSteps ? prev + 1 : prev), 0);
    const maximalStep = results.reduce((prev, curr) => (curr === cfg.maxSteps ? prev : Math.max(prev, curr)), 0);
    const sum = results.reduce((prev, curr) => prev + curr, 0);
    console.debug(`maxStepCnt: ${maxStepCnt}, maximalStep: ${maximalStep}, sum: ${sum}`);
}

export function draw(cfg: DrawConfig) {
    const { ctx } = cfg;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    if (cfg.showLines) {
        ctx.lineWidth = 1;
        drawField(cfg);
    }

    if (cfg.showCharge) {
        ctx.lineWidth = 2;
        drawCharge(cfg.a, CHARGE_RADIUS, cfg);
        drawCharge(cfg.b, CHARGE_RADIUS, cfg);
    }
}

export function drawCharges(cfg: DrawChargesConfig) {
    const { ctx, a, b } = cfg;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.lineWidth = 2;
    for (const charge of cfg.charges) {
        drawCharge(charge, SMALL_CHARGE_RADIUS, cfg);
        drawForces(charge, [a, b]);
    }
}
