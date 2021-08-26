import p5 from "p5";
import Vec2 from "./Vec2";
import Ball from "./Ball";
import Point from "./Point";
import globals from "../globals";
import { Howl } from "howler";

class Map {
    p5: p5;
    mapElements: Array<MapElement>;
    balls: Array<Ball>;

    constructor(p5: p5) {
        this.p5 = p5;
        this.mapElements = [];
        this.balls = [];
    }

    draw(): void {
        this.p5.background(28);

        this.drawMapElements();
        this.drawBalls();
    }

    update(): void {
        this.updateBalls();
    }

    updateBalls(): void {
        this.balls.forEach((ball: Ball) => {
            ball.update(this.mapElements);
        });
    }

    checkCollisions(): void {
        this.mapElements.forEach((mapElement: MapElement) => {
            this.balls.forEach((ball: Ball) => {
                mapElement.checkCollision(ball);
            });
        });
    }

    drawBalls(): void {
        this.balls.forEach((ball: Ball) => {
            ball.drawTrajectory();
        });
        this.balls.forEach((ball: Ball) => {
            ball.draw();
        });
    }
    drawMapElements(): void {
        this.mapElements.forEach((mapElement) => {
            mapElement.draw();
        });
    }

    addBall(ball: Ball): void {
        this.balls.push(ball);
    }
    addMapElement(mapElement: MapElement) {
        this.mapElements.push(mapElement);
    }
}

interface MapElement {
    draw(): void;
    checkCollision(obj: any): void;
}

class MapBorder implements MapElement {
    x: number;
    y: number;
    width: number;
    height: number;
    bounce: number;
    groundFriction: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.bounce = 0.9;
        this.groundFriction = 0.005;
    }

    draw(): void {}

    checkCollision(obj: any): void {
        if (obj instanceof Point) {
            const point = obj;
            if (point.pos.x > this.width - point.offset) {
                point.pos.x = this.width - point.offset;
                point.oldPos.x = point.pos.x + point.velocity.x * this.bounce;
            } else if (point.pos.x < 0 + point.offset) {
                point.pos.x = 0 + point.offset;
                point.oldPos.x = point.pos.x + point.velocity.x * this.bounce;
            }

            if (point.pos.y > this.height - point.offset) {
                point.pos.y = this.height - point.offset;
                point.velocity.x *= this.groundFriction;
                point.oldPos.y = point.pos.y + point.velocity.y * this.bounce;
            } else if (point.pos.y < 0 + point.offset) {
                point.pos.y = 0 + point.offset;
                point.oldPos.y = point.pos.y + point.velocity.y * this.bounce;
            }
        }
    }
}

class Circle implements MapElement {
    p5: p5;
    x: number;
    y: number;
    radius: number;
    center: Vec2;

    constructor(p5: p5, x: number, y: number, radius: number) {
        this.p5 = p5;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.center = new Vec2(this.x, this.y);
    }

    draw(): void {
        this.p5.stroke(255);
        this.p5.strokeWeight(2);
        this.p5.noFill();
        this.p5.ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
        this.p5.strokeWeight(1);
    }

    checkCollision(obj: any): void {
        type RaycastResult = {
            failed: boolean;
            insideCircle: boolean;
            hit: Vec2;
        };
        const getIntersectionPoint = (
            origin: Vec2,
            direction: Vec2,
            offset: number
        ): RaycastResult => {
            const r: RaycastResult = {
                failed: false,
                insideCircle: false,
                hit: new Vec2(0, 0),
            };

            const originToCircle: Vec2 = this.center.copy().sub(origin);
            const radiusSq: number =
                (this.radius - offset) * (this.radius - offset);
            const originToCircleLengthSq: number = originToCircle.magSq();

            const a: number = originToCircle.dot(direction);
            const bSq: number = originToCircleLengthSq - a * a;
            if (radiusSq - bSq < 0) {
                r.failed = true;
                return r;
            }
            const f: number = Math.sqrt(radiusSq - bSq);

            let t: number = 0;
            if (originToCircleLengthSq < radiusSq) {
                // Ray stats inside circle
                r.insideCircle = true;
                t = a + f;
            } else {
                r.insideCircle = false;
                t = a - f;
            }

            const p: Vec2 = origin.copy().add(direction.scale(t));
            r.hit = p;

            return r;
        };

        if (obj instanceof Point) {
            const point: Point = obj;
            const distance: number = point.pos.dist(this.center);
            if (distance >= this.radius - point.offset) {
                const i: RaycastResult = getIntersectionPoint(
                    point.oldPos,
                    point.pos.copy().sub(point.oldPos).normalize(),
                    point.offset
                );
                if (i.failed) return;
                if (!i.insideCircle) {
                    point.pos.set(point.oldPos);
                    return;
                }

                const n: Vec2 = point.pos.copy().sub(this.center).normalize();

                const d: Vec2 = point.pos.copy().sub(point.oldPos);

                const newVel: Vec2 = d.copy().reflect(n);

                point.pos.set(i.hit);
                point.oldPos
                    .set(i.hit)
                    .add(newVel.negate().scale(globals.damping));

                const speed: number = d.mag();
                if (globals.soundEnabled && speed > 1) {
                    const vol: number = this.p5.map(speed, 0, 20, 0.0001, 0.5);
                    console.log(vol);

                    new Howl({
                        src: globals.bounceSound!,
                        autoplay: true,
                        volume: vol,
                    });
                }
            }
        }
    }
}

export default Map;
export { Circle, MapBorder, MapElement };
