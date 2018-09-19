
# Class

## 简单声明

```typescript
class Btn{
    constructor(){}
    state:number;
    onPress(){
        //...
    };
}
let btn = new Btn();
```

## 简单继承

```typescript
class LargeBtn extends Btn{
    constructor(){
        super();
    }
    size:number;
}
let lBtn = new LargeBtn();
```

### 修饰符

* public `default`
* private
* protected
* readonly 限制为只读

```typescript
class MyText{
    name:string;
    private state:number;
    protected size:number;
}
class TextBlock extends MyText{
    setSize(){
        this.size = 100;
        this.state = 5;//error;
    }
}
const input = new TextBlock();
input.size = 50; //error;
input.name = "myInput";

```

### 存取器

* 取值函数`getters`   `get`
* 存值函数`setters`   `set`

与ES6中基本相同

```typescript

class Person{
    private _name:string;
    get name():string{
        return this._name;
    }
    set name(value:string){
        this._name = value;
    }
}

```

不支持降级到ES3，如果没有set，则被推断为readonly

### 静态属性

属于类的属性，而非实例的属性；

```typescript
class Person{
    static style:string = "human";
    style:string = "child";
}
let p = new Person();
console.log(Person.style === p.style);

```

### 抽象类

跟接口类似，不可以单独实例化。不过，可以使用修饰符。

```typescript

abstract class Human{
    speak(who:string):string{
        return `hello,${who}`;
    }
    protected height:number;
    private avgHeight:number;
    public name:string;
}
class Child extends Human{
    constructor(_name:string){
        super();
        this.name = _name;
    }
    play(){
        console.log(`${this.name} is playing`);
    }
}
let lili = new Child(`lili`);
lili.speak('jane');
let jane = new Human();//error

```

### 类的高级使用

```typescript

class Human{
    static type:number = 0x99;
    talk(){}
}
class Child extends Human{
    show(){
        console.log(`the human type is ${Child.type}`);
    }
}
let c = new Child();
c.show();
let nChild: typeof Human = Child;
let nc = new nChild();
nc.talk();
nc.show();//error

```
如上，通过指定变量`let nc:typeof Human`的类型，(使用typeof 指定类型)，来达到构造函数的传递。

```typescript
//1
let nc:typeof Human = Human;
//2
let child = new Child();
let c:Human = child;
//如上，1和2在语法上其实是一样的。
```

