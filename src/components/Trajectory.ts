import p5 from "p5";
import Vec2 from "./Vec2";

export default class Trajectory {
    p5: p5;
    points: Array<Vec2>;
    color: string;

    constructor(p5: p5, color: string) {
        this.p5 = p5;
        this.points = [];
        this.color = color;
    }

    draw(): void {
        this.p5.stroke(this.color);
        this.p5.strokeWeight(2);
        const n: number = this.points.length;
        for (let i = 0; i < n - 1; i++) {
            this.p5.line(
                this.points[i].x,
                this.points[i].y,
                this.points[i + 1].x,
                this.points[i + 1].y
            );
        }
        this.p5.strokeWeight(1);
    }

    addPoint(p: Vec2): void {
        this.points.push(p);
    }

    clear(): void {
        this.points = [];
    }
}
