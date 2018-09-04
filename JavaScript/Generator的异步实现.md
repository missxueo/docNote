
# Generator的异步实现


## 什么是Generator

Generator 为产生器的意思；

```js
function * buildGen(){
    yield 1;
}
const gen = buildGen(); 
//gen 就是一个Generator，可以通过next 函数不断向下调用;
var next = gen.next();
console.log(next);
//{done:false,value:1}

```

## Generator的使用

### 简单迭代

### 迭代对象

## Generator实现异步

### Thunk函数

### co 自运行函数

