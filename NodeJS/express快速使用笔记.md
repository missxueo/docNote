
# express 模块

## 简介

express 是封装了node.js http包的一个开源webapp框架,更多详见[官方中文文档](http://www.expressjs.com.cn/)

> npm install express --save

## express 快速启动

```js
const express = require("express");
const app = express();

app.get("/",function(req,res,next){
    res.send("<h1>Hello World</h1>")
});

app.listen(3000);

//或者通过原生http启动，是为了可以同时监听http和https
const http = require("http");
http.createServer(app.callback()).listen(3001);

```

## express的中间件

中间件是介于request 和 response 之间的处理函数。  

大体上，有以下几种常用中间件，并且可以为中间件添加更多的自定义的中间件。

* 路由
* 错误处理 
* 静态文件访问
* 模板渲染
* 参数处理
* 其它更多

可以观看官方api文档阅读关于中间件的一些资料。

```js
app.use("/index",function(req,res,next){
    //todo    
});

```
## 静态文件

```js
//将static文件注册为静态文件库
app.use("/pub",express.static("static"));   // http://localhost:3000/pub/image/demo.png
app.use(express.static("static"));  // http://localhost:3000/image/demo.png


```
## express的错误处理

错误处理中间件一定要在路由中间件之后添加到app中。

```js
app.use(function(err,req,res,next){
    console.log(err);
    rsp.status(500).send("UNKNOW ERROR");
    //next(err);//传给下一个错误处理中间件
});


```

## express的路由

```js
const router = express.Router();

app.router("/about")
    .get(function(req,res){
        res.render("about");
    })
    .post(function(req,res){
        res.json({
            email:null,
            tel:null,
            addr:null,
        });
    });

let funcList = [];
router.get('/book',function(req,res,next){
    next();
},...funcList);

app.use("/",router);

```

## 更多中间件

* body-parser
* cookie-parser
* ==

## 模板引擎的使用

以下用nunjunks 引擎为例：
> npm install nunjucks --save

```js
const nunjucks = require("nunjucks");
nunjucks.configure("./templates",{
    autoescape:true,
    express:app,
});
//app.set("views","./templates"); 默认为./views文件夹
app.set("view engine","njk");
//todo
app.get("/",function(req,res,next){
    res.render("index");//index.njk
});

```
### express模板引擎的接入原理

通过`app.engine(ext, callback) `就可以开发模板引擎了，如果某些模板引擎未提供express的接入函数，可以通过该函数进行兼容。

```js
const {readFile} = require("fs");
app.engine("njk",function(filepath,options,callback){
    //...
    return callback(...);
});

app.set('views', './views'); // 指定视图所在的位置
app.set('view engine', 'njk'); // 注册模板引擎

```


## 集成数据库

* mongodb 简单使用

> 演示使用 mongodb，详见mongodb简单使用

> npm install mongoose --save

* mysql 简单使用

