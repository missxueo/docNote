# 谈谈JS中的Promise类型

*注: 本文不研究 Promise 机制。*

背景：
有一日，小姐姐问我，项目中有多个ajax同时请求，如何等它们都响应后再处理callback？
虽然我们是 *.Neter* ，不过对于这种问题，其实我们应该知道。

## C#中的 `Task` 类型

身为一个 *.Neter*，我们应该对下面的代码非常熟悉，这里就不详述了。
```c#
public Task<HttpReponseMessage> RequestAsync(string url)
{
    return _client.GetAsync(url);
}

public async Task InvokeAsync(){
    var res = await RequestAsync("http://github.com");
    //todo ...
}

```

## JS中的异步

对于一个JQueryer，我们应该对于下面的AJAX代码非常熟悉:

```javascript
$.get('https://github.com',function(){
    //callback ...    
})
```
但是，我们要当A请求完成响应的时再执行B请求，B响应时再执行C请求呢？？

这代码想想就绕了，更别说写出来有多丑了，这就是著名的*回调地狱*。
```javascript
$.get(urla,function(){
    $.get(urlb,function(){
        $.get(urlc,function(){
            //callback ...    
        }) 
    })
})
```

为了解决这个问题，我们可以使用Generator函数来将异步代码以同步的方式进行书写。

### Generator函数

```JS
const timeOutBuilder = function(time){
    return (callback)=>{
        setTimeout(()=>{
            callback(new Date())
        },time)
    }
}
function * buildGen(){
    yield timeOutBuilder(1000)
    yield timeOutBuilder(2000)
}
//buildGen是个Generator函数
let gen = buildGen()
let result = gen.next()
if(!result.done)
{
    result.value((dt)=>{
        console.log(dt)
        result = gen.next()
        if(!result.done)
        {
            result.value(()=>{
                //...more
            })
        }
    })
}

```
当Generator函数调用的时候，返回一个Iterator迭代器对象，此时Generator函数并未执行，只有调用Iterator的next()方法才开始执行，直到遇到yield关键字或方法结束。

由于Generator函数可以使用next()控制函数的执行流程，所以可以使用逆归函数将

```js


```



而`Promise`就是为了解决这个问题所推出的一个原生类型。
Promise就像一个容器，这个容器有三种状态，pending(进行中)，fulfilled(已成功)，rejected(已失败)；

