
# express 模块

npm install express --save

# express 快速启动

```js
const express = require("express");
const app = express();

//todo

app.listen(3000);

```

# express的中间件

```js
app.use()

//todo

```
# 静态文件

```js
app.use("/pub",express.static("static"));// http://localhost:3000/pub/image/demo.png
app.use(express.static("static"));// http://localhost:3000/image/demo.png


```
# express的错误处理

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