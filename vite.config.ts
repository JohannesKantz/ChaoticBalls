import { defineConfig } from "vite";

export default defineConfig({
    base: "/ChaoticBalls/",
    build: {
        chunkSizeWarningLimit: 1000,
    },
});
