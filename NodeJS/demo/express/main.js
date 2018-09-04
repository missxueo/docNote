
const express = require("express");
const app = express();

const router = express.Router();
router.use("/index",function(req,rsp,next){
    console.log(`in /index`,req.path);
    next();
});

router.get("/index/:id",function(req,rsp,next){
    console.log(`in /index/:id`,req.path);
    next();
});

app.use("/",function(req,rsp,next){
    console.log(`use /`,req.path);
    next();
});
app.use("/home",router);


app.listen(3000);