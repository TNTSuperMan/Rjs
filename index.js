"use strict";

if(process.env.NODE_ENV == "production"){
    module.exports = require("./dist/common.min.js")
}else{
    module.exports = require("./dist/common.js")
}