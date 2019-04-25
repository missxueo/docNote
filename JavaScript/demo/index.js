
var timeoutAsync = new Promise(function(resolve,reject){
    console.log("in actin",new Date().toLocaleTimeString())
    setTimeout(()=>{
        console.log("before callback",new Date().toLocaleTimeString())
        resolve(new Date().toLocaleTimeString())
        reject("err in callback")
    },2000)
})

timeoutAsync
    .then(data=>{
        console.log("callback",data)        
        return Promise.reject("err")
    })
    .catch(err=>{
        console.log("catch",err)
    })
    