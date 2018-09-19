
# 函数

## 声明

```typescript

function func0(value:string):void{
    //...
}

let func1 = function(value:string):void{
    //...
}
//可推断类型
let func2:(vlaue:string)=>void = v=>{
    //...
}

let func3:(value:string)=>void = function(value:string):void{
    //...完整版
}

```

## 参数

TypeScript 里面没一个参数都是必须的。编译器会检查是否每一个参数都传了值。即会检查个数相等

* 可选参数
* 默认参数
* 剩余参数

```typescript
function log(p1:number,p2:number):void{}
log(1);//error,less
log(1,2,3);//error,more
log(1,2); //okay;

```

```typescript
//指定可选参数
function log(p1:number,p2?:number):void{}
log(1);
log(1,3);
log(1,2,3);//error

function log1(p1:number,p2:number=5):void{}
function log2(p1:number=1,p2:number=2):void{}
function log3(p1:number=1,p2:number):void{}
//默认值参数，其中Log3 无效
//必须这样调用 log3(undefined,5);才能获取到默认值；
function log4(p1=1):void{}
//会自动推断类型

```

### 剩余参数

在javascript 中可以通过arguments来访问所有的参数，而在es6中，可以通过 `function(...args){}`来获取到参数列表；

ts上也使用这种方式；

```typescript
function greet(fmt:string,...args:string[]){
    //...
}
greet("hello ,{0},{1},{2}","bill","jane","michal");

```

## THIS和箭头函数

this是js中的一个概念。箭头函数是es6中引入的一种函数简写的语法，而箭头函数中的this指向的是父上下文。

```typescript

let dic = {
    length:10,
    produce:function(){
        return function(){
            return Array(this.length);
        };
    }
};
let func = dic.produce();
let f = func();//error this指向undefined;可以用箭头函数解决

let dic1 = {
    length:10,
    produce:function(){
        return ()=>{
            return Array(this.length);
        };
    }
};

```
如果给编译器设置了--noImplicitThis标记, 编译器会提醒上面的`this`为`any`类型。

### this参数

可以显式得添加`this`参数。`this`参数是个假参数，出现在第一位。

```typescript
interface Card {
    suit: string;
    card: number;
}
interface Deck {
    suits: string[];
    cards: number[];
    createCardPicker(this:Deck):()=>Card;
}
let deck:Deck = {
    suits: ["hearts", "spades", "clubs", "diamonds"],
    cards: Array(52),
    createCardPicker: function(this:Deck):()=>Card{
        return ()=>{
            let card = {} as Card;
            card.suit = this.suits[0];//这里this指向Deck
            return card;
        }
    }
}

```
#### this参数在回调函数里

在回调函数api中经常看见要求的this

```typescript

interface UIElement {
    addClickListener(onclick: (this: void, e: Event) => void): void;
}
class Handler {
    info: string;
    onClickBad(this: Handler, e: Event) {
        this.info = "123";
    }
}
let h = new Handler();
let uiElement:UIElement = {
    addClickListener(onclick){}
}

uiElement.addClickListener(h.onClickBad); // error! 因为this的指向不同

```

如果即想要满足上述条件，又不想改变onClickBad的`this`指向.可以通过箭头函数来解决。

```typescript
class Handler {
    info: string;
    onClickBad:(e: Event)=>{
        this.info = "123";
    }
}

```

## 函数重载

函数重载是指多个具体名称相同，但参数不同的函数。
比如C#中的：

```c#
int n = 3;
n.ToString();
n.ToString("2d");
//..等等
```

而JAVASCRIPT本身是一门动态语言。

```javascript

function log(value,count){
    if(typeof count === 'undefined'){
        //...
    }else{
        //...
    }
}
log("hello");
log("hello",2);
//实现重载

```

以下是typescript的重载定义；

```typescript

function greet(who:string,value:string):void;
function greet(who:string,value:number):any;
function greet(who:string):number;
function greet(v):any{
    if(typeof value === 'string'){
        //...
    }else{}
    //...同js
}
//注意，最后一个带方法体的不属于重载，编译器在查找的时候根据最先匹配到的重载定义。

```

