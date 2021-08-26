import p5 from "p5";
import Point from "./Point";
import Trajectory from "./Trajectory";
import { MapElement } from "./Map";
import Color from "color";

export default class Ball {
    p5: p5;
    point: Point;
    width: number;
    color: Color;
    trajectory: Trajectory;

    constructor(
        p5: p5,
        x: number,
        y: number,
        oldX: number,
        oldY: number,
        width: number,
        color: Color = new Color("#ff0000")
    ) {
        this.p5 = p5;
        this.point = new Point(x, y, oldX, oldY, width / 2);
        this.width = width;
        this.color = color;
        this.trajectory = new Trajectory(this.p5, this.color.darken(0.7));
    }

    update(mapElements: Array<MapElement>) {
        this.point.update();
        this.point.checkCollisions(mapElements);
        this.trajectory.addPoint(this.point.pos.copy());
    }

    draw(): void {
        this.drawBall();
    }

    drawBall(): void {
        this.p5.fill(this.color.hex());
        this.p5.noStroke();
        this.p5.ellipse(
            this.point.pos.x,
            this.point.pos.y,
            this.width,
            this.width
        );
    }

    drawTrajectory(): void {
        this.trajectory.draw();
    }
}
