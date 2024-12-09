"use strict";

if(process.env.NODE_ENV == "production"){
    module.exports = require("./dist/R.cjs.min.js")
}else{
    module.exports = require("./dist/R.cjs.js")
}