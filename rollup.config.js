import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

function cfg(format,name){
    return[{
        input: "./src/index.ts",
        output: {
            file: `./dist/R.${name??format}.js`, format,
            name: "R",
            sourcemap: true
        },
        plugins: [typescript()]
    },{
        input: "./src/index.ts",
        output: {
            file: `./dist/R.${name??format}.min.js`, format,
            name: "R",
            sourcemap: true
        },
        plugins: [typescript(), terser()]
    }]
}
export default [
    ...cfg("amd"),
    ...cfg("cjs"),
    ...cfg("es", "esm"),
    ...cfg("iife", "global"),
    ...cfg("umd"),
    ...cfg("system"),
]