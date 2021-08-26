import Vec2 from "./Vec2";
import { MapElement } from "./Map";
import globals from "../globals";

export default class Point {
    pos: Vec2;
    oldPos: Vec2;
    velocity: Vec2;
    offset: number;
    gravity: Vec2;

    constructor(
        x: number,
        y: number,
        oldX: number,
        oldY: number,
        offset: number = 0
    ) {
        this.pos = new Vec2(x, y);
        this.oldPos = new Vec2(oldX, oldY);
        this.velocity = new Vec2(0, 0);
        this.offset = offset;
        this.gravity = new Vec2(0, globals.gravity);
    }

    update(): void {
        this.velocity.set(this.pos);
        this.velocity.sub(this.oldPos);
        //this.velocity.scale(AirFriction);

        this.oldPos.set(this.pos);
        this.pos.add(this.velocity);
        this.pos.add(this.gravity);
    }

    checkCollisions(mapElements: Array<MapElement>): void {
        mapElements.forEach((mapElement: MapElement) => {
            mapElement.checkCollision(this);
        });
    }
}
