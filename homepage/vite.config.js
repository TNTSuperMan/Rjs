import { defineConfig } from "vite";
import rjs from "./plugin/index";
import { viteSingleFile } from "vite-plugin-singlefile";
import terser from "@rollup/plugin-terser";

export default defineConfig({
    plugins: [rjs(),viteSingleFile()],
    base:".",
    build: {
      minify: 'terser',
    }
})