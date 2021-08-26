import "./styles/style.scss";
import globals from "./globals";
import p5 from "p5";

import Color from "color";

import Map, { Circle } from "./components/Map";

import bounceSound from "./sounds/hit2.mp3";
import Ball from "./components/Ball";
import { createMuteButton } from "./components/MuteButton";

const app: HTMLElement = document.getElementById("app")!;

new p5((p5) => {
    p5.preload = () => {
        globals.bounceSound = bounceSound;
    };
    p5.setup = () => {
        p5.createCanvas(globals.WIDTH, globals.HEIGHT);

        p5.frameRate(globals.FPS);

        createMuteButton(app);
        initBoucingBalls(p5);
    };
    p5.draw = () => {
        p5.background(0);

        globals.map!.draw();
        globals.map!.update();
    };
}, app);

function initBoucingBalls(p5: p5) {
    const map = new Map(p5);
    globals.map = map;

    const w = globals.WIDTH / 2;
    const h = globals.HEIGHT / 3;

    // map.addMapElement(new MapBorder(0, 0, globals.WIDTH, globals.HEIGHT));

    map.addMapElement(
        new Circle(
            p5,
            globals.WIDTH / 2,
            globals.HEIGHT / 2,
            globals.WIDTH / 2 - 50
        )
    );

    // 0.0005 difference
    map.addBall(
        new Ball(p5, w + 0.001, h, w + 0.001, h, 20, new Color("#ff0000"))
    );
    map.addBall(
        new Ball(p5, w + 0.0015, h, w + 0.0015, h, 20, new Color("#00ffff"))
    );
}
