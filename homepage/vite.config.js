import { defineConfig } from "vite";
import rjs from "./plugin/index";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
    plugins: [rjs(),viteSingleFile()],
    base:".",
    build: {
      minify: 'terser',
      modulePreload: false
    }
})