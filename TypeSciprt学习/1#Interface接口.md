
# 接口声明

采用`鸭式辨型法`，不需要对参数进行继承

```typescript
interface Person{
    name: string;
    age: number;
    height?: number; //? 可选属性
    readonly width: number; //readonly 初始化时赋值
    values:ReadonlyArray<any>;
}
let p :Person = {...};
let arr = p.values as any[];//可断言赋值

function sayHello(p:Person){
    //...
}
sayHello({namme:"json",...})//如果出现了不在接口的参数，则出现警告，则可以加上如下：
interface Person{
    //...
    [propName:string] :any;
}

```
## 定义函数接口

定义函数签名

```typescript
interface IExist{
    (fileName:string,pathName?:string):boolean;
}
let exist:IExist = function(file,path){
    return true;
}
let ifExist = exist('index.js');

```

## 可索引类型

可通过 list[1] 或 dic["key"] 等通过索引得到的类型；
dic["key"] 字符串索引类型，定义 dic["key"]和dic.key 类型

```typescript
interface Person{
    readonly [index:number]:any;
        
}
let p :Person = {};
//error,because of readonly!
p[12] = "record";

```

## 类类型

```typescript
interface IProvide{
    args?:string[];
    result:any;
    execute(cmd:string):boolean;
}
class CmdProvide implements IProvide{
    constructor(public host:string,public port?:number){}
    result:any;
    execute(cmd:string):boolean{
        //...
    }
}

```
构造器为类的静态部分；其它属性为类的实例部分。当类实现了一个接口，只对类的实例部分进行检查。
```typescript
//用构造器签名定义一个接口
interface IProvideConstructor{
    new(host:string,port?:number):IProvide;
}

function provideFactory(ctor:IProvideConstructor,host:string,port?:number):IProvide{
    return new ctor(host,port);
}

```

## 接口继承

```typescript
interface Shape{
    point:string;
}
interface Color{
    color:string;
    opcity:number;
}
interface Square extends Color,Shape{
    sideLength:number;
}
const square = {} as Square;
square.color = 'red';

```

## 混合类型

有时希望一个类型同时具有以上的多种类型。比如一个对象同时又是函数

```typescript
interface IProvide{
    (cmd:string):void;
    timeout:number;
    execute(cmd:string):void;
}
function getProvide(cmd:string):IProvide{
    let provider = <IProvide>function(cmdText){
        return;
    };
    provider.execute = (cmd)=>({});
    return provider;
}
const provider = getProvide("ls -a");
provider("cd ..");
provider.timeout = 10;
```

## 接口继承类

如果接口继承类，则会继承类的成员，但不包括实现；

```typescript
class Btn{
    state:number;
}
interface IBtn extends Btn{
    click():void;
}
class MyBtn implements IBtn{
    click(){}
    state:number;
}
```

如果基类中有private 或 protected 字段；则这个接口只能被这个类或子类所实现；

```typescript
class Component{
    private state:number;
}
interface IComponent extends Component{
    focus():void;
}
class MyButton extends Component{
    render(){/***/}
}
class MyText extends Component implements IComponent{
    focus(){/***/}
}
class MyView implements IComponent{ //error 
    focus(){}
}
```