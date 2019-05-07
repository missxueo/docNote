
# Generator的异步实现


## 什么是Generator

Generator 为生成器的意思；


## Generator的简单使用

通过在申明方法的时候使用 * 和方法内使用`yield` 来表明自己的生成器函数身份。而调用生成器函数返回一个生成器。

```js
function * buildGen(){
    let r = yield 1;
    console.log(`get: ${r}`);
    return 2;
}
const gen = buildGen(); 
//gen 就是一个Generator，可以通过next 函数不断向下调用;
var next = gen.next();
console.log(next);
//{done:false,value:1}
next = gen.next("hello");
//get: hello
console.log(next);
//{done:true,value:2}

```

如上所示，调用`buildGen`后并没有立即执行，需要通过`next`函数才能工作，调用`next()`后返回一个显示当前完成状态和返回值的对象。
我们也可以通过向`next` 函数传递参数，完成向生成器传递信息。

## Generator实现异步

通过Generator可以将JS的多重回调写法，变成同步写法。使异步使用更加易于理解。

```js
function * buildGen(){
    yield timeOutLogAsync(1000);
    yield timeOutLogAsync(2000);
    //yield readFileAsync('./test.txt');
}
function timeOutLogAsync(millseconds){
    return (callback)=>{
        setTimeout(callback,millseconds);
    }
}
const gen = buildGen();
gen.next().value(()=>{
    console.log(`first setTimeout is called`);
    gen.next().value(()=>{
        console.log(`sencond setTimeout is called`);
        //gen.next();
    });
});

```

以上代码还有一个问题，就是在需要手动执行`next`的来执行下一步，并且嵌套回调的结构也不利于阅读。不过可以通过引入自运行函数来解决这个问题。

```js
function run(generator){
    const gen = generator();
    //内部实现了一个逆归调用
    function next(err,value){
        if(err){
            throw err;
        }
        let handler = gen.next(value);
        if(handler.done){
            return;
        }
        handler.value(next);
    }
    next();
}
run(buildGen);

```

### Thunk函数

在 JavaScript 语言中，Thunk 函数替换的不是表达式，而是多参数函数，将其替换成单参数的版本，且只接受回调函数作为参数。

```js
//正常函数
fs.readFile(fileName,callback);

const readFileThunk = function(fileName){
    return (callback)=>{
        fs.readFile(fileName,callback);
    }
}
//thunk函数
readFileThunk(fileName)(callback);

```

#### thunkify 模块

> npm install thunkify

使用如下

```js
const thunkify = require("thunkify");
const fs = require("fs");
const readFileThunk = thunkify(fs.readFile);
readFileThunk('./test.txt')(function(err,value){
    //...
});

```
> 源码见[github](https://github.com/tj/node-thunkify)

根据源码，thunkify 只能针对如`fs.readFile(...args[],callback)`这样将callback作为最后一个参数的标准函数，如果想要使用像`setTimeout(callback,time)`这样的函数，则需要我们做一个转换，如:

```js
const executeTimeout = (time,callback) => setTimeout(callback,time);
const executeTimeoutThunk = thunkify(executeTimeout);
executeTimeoutThunk(1000)(function(){
    console.log(new Date())    ;
});

```

### co 模块

co模块是个流程管理模块。
