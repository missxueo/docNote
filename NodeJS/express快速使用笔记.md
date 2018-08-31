
# express 模块

npm install express --save

# express 快速启动

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

# express的中间件

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
# 静态文件

```js
//将static文件注册为静态文件库
app.use("/pub",express.static("static"));// http://localhost:3000/pub/image/demo.png
app.use(express.static("static"));// http://localhost:3000/image/demo.png


```
# express的错误处理

错误处理中间件一定要在路由中间件之后添加到app中。

```js
app.use(function(err,req,res,next){
    console.log(err);
    next(err);//传给下一个错误处理中间件
});


```

# express的路由

```js
const router = express.Router();

//todo


```

# 更多中间件

* body-parser
* cookie-parser
* ==

# 模板引擎的使用

exp:
npm install nunjucks --save

```js
const nunjucks = require("nunjucks");
nunjucks.configure("./templates",{
    autoescape:true,
    express:app,
});
app.set("view engine","njk");
//todo
app.get("/",function(req,res,next){
    res.render("index");//index.njk
});

```
express模板引擎的接入原理

# 集成数据库
> 演示使用 mongodb
npm install mongoose --save

```js

```