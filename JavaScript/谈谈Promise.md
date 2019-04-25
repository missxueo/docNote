# 谈谈JS中的Promise类型

*注: 本文不研究 Promise 机制。*

背景：
有一日，小姐姐问我，项目中有多个ajax同时请求，怎么去callback？
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

## `Promise` : JS中的*Task*

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

而`Promise`就是为了解决这个问题所推出的一个原生类型。
Promise就像一个容器，这个容器有三种状态，pending(进行中)，fulfilled(已成功)，rejected(已失败)；

