import type { ConfigState } from "@/stores/config-store";
import { CHARGE_RADIUS, CROSS_ERRROR } from "./constants";
import { Vector, type Point } from "./math";

type Rect = {
    x: number;
    y: number;
    width: number;
    height: number;
};

function isInRect(point: Point, rect: Rect) {
    return point.x >= rect.x && point.x <= rect.width && point.y >= rect.y && point.y <= rect.height;
}

function getRect(ctx: CanvasRenderingContext2D) {
    return {
        x: 0,
        y: 0,
        width: ctx.canvas.width,
        height: ctx.canvas.height,
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

function drawFieldLine(
    ctx: CanvasRenderingContext2D,
    angle: Point,
    start: Point,
    end: Point,
    charge1: number,
    charge2: number,
    color: string,
    cfg: ConfigState
) {
    if(charge1 == 0) return 0;

    if (charge1 < 0) {
        charge1 *= -1;
        charge2 *= -1;
    }

    ctx.beginPath();
    ctx.moveTo(start.x, start.y);

    let x = angle.x + start.x;
    let y = angle.y + start.y;
    let vecStart = new Vector(x - start.x, y - start.y);
    let vecEnd = new Vector(x - end.x, y - end.y);
    let step = 0;

    let prevRes: Vector | null = null;
    let crossMult = 0;
    while (vecEnd.length > cfg.stepSize && step < cfg.maxSteps) {
        const force1 = charge1 / Math.pow(vecStart.length, 3);
        const force2 = charge2 / Math.pow(vecEnd.length, 3);

        const res = vecStart.scale(force1).add(vecEnd.scale(force2)).scale(cfg.stepSize);
        if (isInRect({ x, y }, getRect(ctx))) {
            ctx.lineTo(x + res.x, y + res.y);
        } else if (isInRect({ x: x + res.x, y: y + res.y }, getRect(ctx))) {
            ctx.moveTo(x, y);
            ctx.lineTo(x + res.x, y + res.y);
        }
        if (res.isNull()) break;

        // check if new vector is "closer" to the -end vector
        if (!isInRect({ x, y }, getRect(ctx)) && prevRes) {
            crossMult = prevRes.cross(res) * prevRes.cross(vecEnd.scale(cfg.stepSize));
            if (crossMult >= -CROSS_ERRROR) break; // the new vecror and the vector from end are in the same direction
        }

        x += res.x;
        y += res.y;
        vecStart = new Vector(x - start.x, y - start.y);
        vecEnd = new Vector(x - end.x, y - end.y);

        prevRes = res;
        step++;
    }
    ctx.strokeStyle = color;
    ctx.stroke();
    return step;
}

function drawField(ctx: CanvasRenderingContext2D, cfg: ConfigState, a: Point, b: Point) {
    const startVecs: Vector[] = [];
    startVecs.push(new Vector(0, cfg.stepSize).rotate(cfg.offset * (Math.PI / 180)));
    for (let i = 1; i < cfg.lineCount; i++) {
        startVecs.push(startVecs[i - 1].rotate((2 * Math.PI) / cfg.lineCount));
    }

    const results: number[] = [];
    for (const vec of startVecs) {
        let steps = drawFieldLine(ctx, vec, a, b, cfg.charge1, cfg.charge2, cfg.lineColor1, cfg);
        results.push(steps);

        if (cfg.charge1 * cfg.charge2 < 0 && !cfg.bothSides) continue;
        steps = drawFieldLine(ctx, { x: -vec.x, y: -vec.y }, b, a, cfg.charge2, cfg.charge1, cfg.lineColor2, cfg);
        results.push(steps);
    }
    const maxStepCnt = results.reduce((prev, curr) => (curr === cfg.maxSteps ? prev + 1 : prev), 0);
    const maximalStep = results.reduce((prev, curr) => (curr === cfg.maxSteps ? prev : Math.max(prev, curr)), 0);
    console.log(`maxStepCnt: ${maxStepCnt}, maximalStep: ${maximalStep}`);
}

export function draw(ctx: CanvasRenderingContext2D, cfg: ConfigState) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const centerY = ctx.canvas.height / 2;
    const centerX1 = (ctx.canvas.width * 2) / 5;
    const centerX2 = (ctx.canvas.width * 3) / 5;

    if (cfg.showLines) {
        ctx.lineWidth = 1;
        drawField(ctx, cfg, { x: centerX1, y: centerY }, { x: centerX2, y: centerY });
    }

    if (cfg.showCharge) {
        ctx.lineWidth = 2;
        drawCharge(ctx, centerX1, centerY, CHARGE_RADIUS, cfg.chargeColor1, cfg.charge1);
        drawCharge(ctx, centerX2, centerY, CHARGE_RADIUS, cfg.chargeColor2, cfg.charge2);
    }
}
