import Map from "./components/Map";
interface Iglobals {
    WIDTH: number;
    HEIGHT: number;
    FPS: number;
    soundEnabled: boolean;
    gravity: number;
    damping: number;
    bounceSound?: string;
    map?: Map;
    [key: string]: any;
}

const globals: Iglobals = {
    WIDTH: 600,
    HEIGHT: 600,
    FPS: 60,
    soundEnabled: false,
    gravity: 0.4,
    damping: 0.99,
};
export default globals;
