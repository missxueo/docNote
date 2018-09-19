
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

* getters   `get`
* setters   `set`

```typescript


```
