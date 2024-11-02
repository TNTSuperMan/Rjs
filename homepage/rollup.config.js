//import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import rjsplugin from "./plugin/index.js"

export default {
    input: "./src/main.js",
    output:{
        file: "./dist/script.js",
        format: "iife"
    },
    plugins: [
        /*typescript(), terser(),*/ rjsplugin()
    ]
}