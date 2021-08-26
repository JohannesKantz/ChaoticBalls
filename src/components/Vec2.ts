/**
 * 2 dimensional vector
 * @class Vec2
 * @constructor
 * @param {number} x x value
 * @param {number} y y value
 */
class Vec2 {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /**
     * Sets x and y
     * @param {Number} x x value
     * @param {Number} y y value
     */
    set(x: number, y: number): Vec2;
    /**
     * Sets x and y
     * @param vec new value
     */
    set(vec: Vec2): Vec2;
    set(x: any, y?: any): Vec2 {
        if (x instanceof Vec2) {
            return this.set(x.x, x.y);
        }
        this.x = x;
        this.y = y;
        return this;
    }

    /**
     * Addition
     * @param s summand
     */
    add(s: number): Vec2;
    /**
     * Adds Vector
     * @param vec Vector
     */
    add(vec: Vec2): Vec2;
    add(s: any): Vec2 {
        if (s instanceof Vec2) {
            this.x += s.x;
            this.y += s.y;
            return this;
        }
        this.x += s;
        this.y += s;
        return this;
    }

    /**
     * Subtraction
     * @param s subtrahend
     */
    sub(s: number): Vec2;
    /**
     * Subtracts Vector
     * @param vec Vector
     */
    sub(vec: Vec2): Vec2;
    sub(s: any): Vec2 {
        if (s instanceof Vec2) {
            this.x -= s.x;
            this.y -= s.y;
            return this;
        }
        this.x -= s;
        this.y -= s;
        return this;
    }

    /**
     * Multiplication
     * @param f factor
     */
    scale(f: number): Vec2;
    /**
     * Multiply Vector
     * @param vec Vector
     */
    scale(vec: Vec2): Vec2;
    scale(f: any): Vec2 {
        if (f instanceof Vec2) {
            this.x *= f.x;
            this.y *= f.y;
            return this;
        }
        this.x *= f;
        this.y *= f;
        return this;
    }

    /**
     * Division
     * @param d divisor
     */
    div(d: number): Vec2;
    /**
     *  Divides Vector
     * @param vec Vector
     */
    div(vec: Vec2): Vec2;
    div(d: any): Vec2 {
        if (d instanceof Vec2) {
            if (!Number.isFinite(d.x) || !Number.isFinite(d.y)) {
                console.error("Vec2: ", "dividing by not finite numbers");
                return this;
            }
            if (d.x === 0 || d.y === 0) {
                console.error("Vec2: ", "cannot divide by 0");
                return this;
            }
            this.x /= d.x;
            this.y /= d.y;
            return this;
        }
        this.x /= d;
        this.y /= d;
        return this;
    }

    /**
     * Calculates the squared magnitude
     * @returns {number} squared magnitude
     */
    magSq() {
        return this.x * this.x + this.y * this.y;
    }

    /**
     * Calculates the magnitude (length) of the vector
     * @returns {number} magnitude
     */
    mag(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * Set the magnitude of this vector
     * @param {number} m new magnitude
     */
    setMag(m: number): Vec2 {
        return this.normalize().scale(m);
    }

    /**
     * Computes dot product with another vector
     * @param {Vec2} vec Vector
     * @returns {Vec2}  dot product
     */
    dot(vec: Vec2): number {
        return this.x * vec.x + this.y * vec.y;
    }

    /**
     * Normalize the vector to length 1
     */
    normalize(): Vec2 {
        const length: number = this.mag();
        if (length > 1) {
            this.scale(1 / length);
        }
        return this;
    }

    /**
     * Calculates distance to another vector
     * @param {Vec2} vec Vector
     * @returns {number} distance
     */
    dist(vec: Vec2): number {
        const dx = vec.x - this.x;
        const dy = vec.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Inverts the vector
     */
    negate(): Vec2 {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }

    /**
     * Calculates the angle between the vector and the x axis
     * @param {string} angleMode degrees(default) or radians
     * @returns {number} angle
     */
    angle(
        angleMode: "degrees" | "deg" | "radians" | "rad" = "degrees"
    ): number {
        const angle = Math.atan2(this.y, this.x); // Radians
        if (angleMode === "radians" || angleMode === "rad") return angle;

        const degrees = (180 * angle) / Math.PI;
        return degrees;
    }

    /**
     * Sets the angle of the vector relative to the x axis - (0,1) has angle of 0
     * @param {number} angle angle of Rotation
     * @param {string} angleMode degrees(default) or radians
     * @param {boolean} clockwise clockwise(default) true or counterClockwise false
     */
    setAngle(
        angle: number,
        angleMode: "degrees" | "deg" | "radians" | "rad" = "degrees",
        clockwise: boolean = true
    ): Vec2 {
        const a =
            angleMode === "degrees" || angleMode === "deg"
                ? clockwise
                    ? -angle * (Math.PI / 180)
                    : angle * (Math.PI / 180)
                : clockwise
                ? -angle
                : angle;
        const mag = this.mag();
        const cos = Math.cos(a) * mag;
        const sin = Math.sin(a) * mag;

        this.set(
            Math.round(10000 * cos) / 10000,
            Math.round(10000 * sin) / 10000
        );

        // x and y are somtimes -0
        if (Object.is(this.x, -0)) this.x = 0;
        if (Object.is(this.y, -0)) this.y = 0;

        return this;
    }

    /**
     * Rotate the vector by an angle
     * @param {number} angle angle of rotation
     * @param {string} angleMode degrees(default) or radians
     * @param {boolean} clockwise clockwise(default) true or counterClockwise false
     */
    rotate(
        angle: number,
        angleMode: "degrees" | "deg" | "radians" | "rad" = "degrees",
        clockwise: boolean = true
    ): Vec2 {
        const a =
            angleMode === "degrees" || angleMode === "deg"
                ? clockwise
                    ? -angle * (Math.PI / 180)
                    : angle * (Math.PI / 180)
                : clockwise
                ? -angle
                : angle;

        const cos = Math.cos(a);
        const sin = Math.sin(a);

        this.set(
            Math.round(10000 * (this.x * cos - this.y * sin)) / 10000,
            Math.round(10000 * (this.x * sin + this.y * cos)) / 10000
        );

        // x and y are somtimes -0
        if (Object.is(this.x, -0)) this.x = 0;
        if (Object.is(this.y, -0)) this.y = 0;
        return this;
    }

    /**
     * Find angle between the vector and another vector
     * @param {Vec2} vec Vector to calculate angle to
     * @param {string} angleMode degrees(default) or radians
     * @returns {number} angle between the two vectors
     */
    angleTo(
        vec: Vec2,
        angleMode: "degrees" | "deg" | "radians" | "rad" = "degrees"
    ): number {
        const angle = Math.atan2(vec.y, vec.x) - Math.atan2(this.y, this.x);
        if (angleMode === "radians" || angleMode === "rad") return angle;
        const degrees = (180 * angle) / Math.PI;
        return degrees;
    }

    /**
     * Reflect the incoming vector about a normal
     * @param {Vec2} surfaceNormal the vector to reflect about
     */
    reflect(surfaceNormal: Vec2): Vec2 {
        surfaceNormal.normalize();
        return this.sub(surfaceNormal.scale(2 * this.dot(surfaceNormal)));
    }

    /**
     * Creates an orthogonal vector
     * @param {boolean} clockwise clockwise(default) or counterClockwise
     * @returns {Vec2} Orthogonal vector
     */
    getOrthogonalVector(clockwise: boolean = true) {
        if (clockwise) {
            return new Vec2(this.y, -this.x);
        } else {
            return new Vec2(-this.y, this.x);
        }
    }

    /**
     * Checks if the x and y values are the same
     * @param {Vec2} vec Vector
     * @returns {boolean} true if the x and y values are the same
     */
    equals(vec: Vec2): boolean {
        return this.x === vec.x && this.y === vec.y;
    }

    /**
     * Gets a copy of the vector
     * @returns copy of Vector
     */
    copy(): Vec2 {
        return new Vec2(this.x, this.y);
    }
}

export default Vec2;
