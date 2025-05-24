import type { ConfigState } from "@/stores/config-store";
import { CHARGE_RADIUS, CROSS_ERRROR } from "./constants";
import { Vector, type Point } from "./math";

type Rect = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
};

interface DrawConfig extends ConfigState {
    ctx: CanvasRenderingContext2D;
    a: Point;
    b: Point;
}

function isInRect(point: Point, rect: Rect) {
    return point.x >= rect.x1 && point.x <= rect.x2 && point.y >= rect.y1 && point.y <= rect.y2;
}

function getPaintRect(cfg: DrawConfig): Rect {
    const { a, b } = cfg;
    const { width, height } = cfg.ctx.canvas;
    return {
        x1: Math.min(a.x, b.x, 0),
        y1: Math.min(a.y, b.y, 0),
        x2: Math.max(a.x, b.x, width),
        y2: Math.max(a.y, b.y, height),
    };
}

function drawCharge(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string, sign: number) {
    ctx.fillStyle = color;
    ctx.strokeStyle = "#000000";

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    const size = radius * 0.5;
    if (sign != 0) {
        ctx.beginPath();
        ctx.moveTo(x - size, y);
        ctx.lineTo(x + size, y);
        ctx.stroke();
    }
    if (sign > 0) {
        ctx.beginPath();
        ctx.moveTo(x, y - size);
        ctx.lineTo(x, y + size);
        ctx.stroke();
    }
}

function getStepSize(normForce: number, dist: number) {
    return (1 / normForce) * dist / 20;
}

function calcForce(vecStart: Vector, vecEnd: Vector, chargeStart: number, chargeEnd: number) {
    const forceStart = chargeStart / Math.pow(vecStart.length, 2);
    const forceEnd = chargeEnd / Math.pow(vecEnd.length, 2);
    const resForceVec = vecStart.scale(forceStart).add(vecEnd.scale(forceEnd));
    return { resForceVec, forceStart, forceEnd };
}

function getRK4Step({ x, y }: Point, h: number, func: (x: number, y: number) => Vector) {
    /* func should return normalised vector */
    const k1 = func(x, y);
    const k2 = func(x + (h / 2) * k1.x, y + (h / 2) * k1.y);
    const k3 = func(x + (h / 2) * k2.x, y + (h / 2) * k2.y);
    const k4 = func(x + h * k3.x, y + h * k3.y);
    return new Vector(
        h / 6 * (k1.x + 2 * k2.x + 2 * k3.x + k4.x),
        h / 6 * (k1.y + 2 * k2.y + 2 * k3.y + k4.y)
    );
}

function drawFieldLine(
    angle: Point,
    start: Point,
    end: Point,
    chargeStart: number,
    chargeEnd: number,
    color: string,
    cfg: DrawConfig
) {
    const { ctx } = cfg;
    const dist = new Vector(end.x - start.x, end.y - start.y).length;

    if (chargeStart == 0) return 0;
    [chargeStart, chargeEnd] = chargeStart > 0 ? [chargeStart, chargeEnd] : [-chargeStart, -chargeEnd];

    let x = angle.x + start.x;
    let y = angle.y + start.y;
    let vecStart = new Vector(x - start.x, y - start.y);
    let vecEnd = new Vector(x - end.x, y - end.y);
    let step = 0;

    let prevRes: Vector | null = null;
    let crossMult = 0;

    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    while (vecEnd.length > CHARGE_RADIUS && step < cfg.maxSteps) {
        const { resForceVec, forceStart, forceEnd } = calcForce(vecStart, vecEnd, chargeStart, chargeEnd);
        const normForce = resForceVec.mult(1 / Math.sqrt(Math.abs(forceStart * forceEnd)));

        let stepSize = Math.max(cfg.stepSize, getStepSize(normForce.length, dist));
        if(isInRect({ x, y }, {x1: 0, y1: 0, x2: ctx.canvas.width, y2: ctx.canvas.height})) {
            stepSize = cfg.stepSize;
        }

        const change = getRK4Step({ x, y }, stepSize, (_x, _y) => {
            const _vecStart = new Vector(_x - start.x, _y - start.y);
            const _vecEnd = new Vector(_x - end.x, _y - end.y);
            return calcForce(_vecStart, _vecEnd, chargeStart, chargeEnd).resForceVec.scale(1);
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
            crossMult = prevRes.cross(change) * prevRes.cross(vecEnd.scale(stepSize));
            if (crossMult >= -CROSS_ERRROR) break; // the new vector and the vector from end are in the same direction
        }

        x += change.x;
        y += change.y;
        vecStart = new Vector(x - start.x, y - start.y);
        vecEnd = new Vector(x - end.x, y - end.y);

        prevRes = change;
        step++;
    }
    ctx.strokeStyle = color;
    ctx.stroke();
    return step;
}

function drawField(cfg: DrawConfig) {
    const startVecs: Vector[] = [];
    startVecs.push(new Vector(0, cfg.stepSize).rotate(cfg.offset * (Math.PI / 180)));
    for (let i = 1; i < cfg.lineCount; i++) {
        startVecs.push(startVecs[i - 1].rotate((2 * Math.PI) / cfg.lineCount));
    }

    const results: number[] = [];
    for (const vec of startVecs) {
        let steps = drawFieldLine(vec, cfg.a, cfg.b, cfg.charge1, cfg.charge2, cfg.lineColor1, cfg);
        results.push(steps);

        if (cfg.charge1 * cfg.charge2 < 0 && !cfg.bothSides) continue;
        steps = drawFieldLine({ x: -vec.x, y: vec.y }, cfg.b, cfg.a, cfg.charge2, cfg.charge1, cfg.lineColor2, cfg);
        results.push(steps);
    }
    const maxStepCnt = results.reduce((prev, curr) => (curr === cfg.maxSteps ? prev + 1 : prev), 0);
    const maximalStep = results.reduce((prev, curr) => (curr === cfg.maxSteps ? prev : Math.max(prev, curr)), 0);
    const sum = results.reduce((prev, curr) => prev + curr, 0);
    console.log(`maxStepCnt: ${maxStepCnt}, maximalStep: ${maximalStep}, sum: ${sum}`);
}

export function draw(cfg: DrawConfig) {
    const { ctx, a, b } = cfg;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    if (cfg.showLines) {
        ctx.lineWidth = 1;
        drawField(cfg);
    }

    if (cfg.showCharge) {
        ctx.lineWidth = 2;
        drawCharge(ctx, a.x, a.y, CHARGE_RADIUS, cfg.chargeColor1, cfg.charge1);
        drawCharge(ctx, b.x, b.y, CHARGE_RADIUS, cfg.chargeColor2, cfg.charge2);
    }
}
