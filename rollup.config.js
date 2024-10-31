import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

function cfg(out,ismin){
    return{
        input: "./src/index.ts",
        output: out,
        plugins: ismin ? [
            typescript(), terser()
        ] : [typescript()]
    }
}
export default [
    cfg({
        file: "./dist/module.js"}),
    cfg({
        file: "./dist/module.min.js"},1),
    cfg({
        file: "./dist/browser.js",
        format: "iife",
        name: "R"}),
    cfg({
        file: "./dist/browser.min.js",
        format: "iife",
        name: "R"},1)
]