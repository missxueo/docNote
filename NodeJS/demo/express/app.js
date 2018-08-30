
'use strict'

const express = require("express");
const app = express();
const nunjucks = require("nunjucks");
const bookRouter = require("./controllers/book").router;

//将static文件注册为静态文件库
//访问 /markdown/readme.md 即可
app.use(express.static("static"));
// /pub/markdown/readme.md
app.use("/pub",express.static("static"));

const env = nunjucks.configure("views",{
    autoescape:true,
    express:app,
});
app.set("view engine","njk");
//route
app.get('/',function(request,response){
    response.send("<h1>Hello World</h1>");    
});

function * greet(){
    yield (req,rsp,next)=>{
        console.log("response will send to next()");
        next();
    }
    yield (req,rsp,next)=>{
        rsp.send("<h1>HI,this is the Greeting</h1>");
    }
}

app.get('/greet',...greet());

app.route('/about')
    .get(function(req,rsp){
        console.log(`this is the get method /about`);
        rsp.send(`:about us`);
    })
    .post(function(req,rsp){
        console.log(`this is the post method /about`);
        rsp.sendFile(`:about us`);
    });

app.use("/",bookRouter);

app.use(function(err,req,rsp,next){
    console.log(`error:${err}`);
    rsp.status(500).send("internal error..");
});

const server = app.listen(3000,function(){
    const host = server.address().address;
    const port = server.address().port;
    console.log(`Express application listenning at ${host}:${port}`);
});

