const express = require("express");
const router = express.Router();

function * get(){
    yield (req,rsp,next)=>{
        
        console.log("response will send to next()");
        rsp.locals.version="0.3.1";
        rsp.locals.dir = __dirname;
        next();
    }
    yield (req,rsp,next)=>{


        rsp.render("index",{author:{
            name:"jackie",
            age:35
        }});
    }
}
router.get('/book',...get());

module.exports.router = router;