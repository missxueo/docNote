
'use strict'

//什么是Thunk函数?

// function Thunk(fn){
//     return function(...args){
//         return function(callback){
//             fn(...args,callback);
//         }
//     }
// }

// //可以使用thunkify
// //npm install thunkify


// //以fs.readFile(path[, options], callback) 为例
// import { readFile } from "fs";
// const readFileThunk = Thunk(readFile);

// function * gen(){
//     let r1 = yield readFileThunk("./test.txt");
//     console.log(r1);
//     let r2 = yield readFileThunk("./test2.txt");
//     console.log(r2);
// }

// //原始
// const g = gen();
// g.next().value((err,value)=>{
//     g.next(value).value((err,value)=>{
//         g.next(value);
//     });
// });

// //自执行流程
// function run(gen){
//     gen = gen();
//     function next(err,value){
//         if(err)
//             throw err;
//         let handler = gen.next(value);
//         if(handler.done){
//             return;
//         }
//         handler.value(next);
//     }
//     next();
// }
// run(gen);

//引入co模块
//
const co = require("co")
const thunkify = require("thunkify")

const fs = require("fs")

const readFileThunk = thunkify(fs.readFile)

co(function * (){
    var text1 = yield readFileThunk("./gen.js",{encoding:'utf8'});
    console.log(text1);
    var text2 = yield readFileThunk("./index.js",{encoding:'utf8'});
    console.log(text2);
})