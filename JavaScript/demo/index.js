
// var timeoutAsync = new Promise(function(resolve,reject){
//     console.log("in actin",new Date().toLocaleTimeString())
//     setTimeout(()=>{
//         console.log("before callback",new Date().toLocaleTimeString())
//         reject("err in callback")
//         resolve(new Date().toLocaleTimeString())
//     },2000)
// })

// timeoutAsync
//     .then(data=>{
//         console.log("callback",data)        
//         return Promise.reject("err")
//     })
//     .catch(err=>{
//         console.log("catch",err)
//     })


const timeOutBuilder = function(miletime)
{
    return (callback)=>{
        setTimeout(()=>{
            callback(new Date())
        },miletime)
    }
}


function * genBuilder()
{
    yield timeOutBuilder(1000)
    yield timeOutBuilder(2000)
}

const gen = genBuilder();
var {done,value} = gen.next()   
if(!done){
    value((dt)=>{
        console.log(dt)
        var {done,value} = gen.next()
        if(!done)
        {
            value((dt)=>{
                console.log(dt)
            })
        } 
    })
}

function co(generator)
{
    const gen = generator()
    
    if(!gen.hasOwnProperty("next"))
        throw 'none interator object'
    let {done,value} = gen.next()
    if(done)
        return
    value(()=>{
        co(gen)
    })
}