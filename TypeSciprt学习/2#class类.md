
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