interface Point {
    x: number;
    y: number;
}

class Vector implements Point {
    public readonly x: number;
    public readonly y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    rotate(angle: number) {
        return new Vector(
            this.x * Math.cos(angle) - this.y * Math.sin(angle),
            this.x * Math.sin(angle) + this.y * Math.cos(angle)
        );
    }

    scale(newLength: number) {
        const factor = this.length / newLength;
        return new Vector(this.x / factor, this.y / factor);
    }

    add(vector: Vector) {
        return new Vector(this.x + vector.x, this.y + vector.y);
    }

    mult(scalar: number) {
        return new Vector(this.x * scalar, this.y * scalar);
    }

    cross(vector: Vector) {
        return this.x * vector.y - this.y * vector.x;
    }

    isNull() {
        return this.x === 0 && this.y === 0;
    }

    get length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
}

export { Vector, type Point };
