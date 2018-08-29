
const express = require("express");
const router = express.Router();

function * get(){
    yield (req,rsp,next)=>{
        console.log("response will send to next()");
        next();
    }
    yield (req,rsp,next)=>{
        rsp.sendFile(`${__dirname}/book.js`);
    }
}
router.get('/book',...get());

module.exports.router = router;