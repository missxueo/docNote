

function * buildGen(){
    yield timeOutLogAsync(1000);
    yield timeOutLogAsync(2000);
    //yield readFileAsync('./test.txt');
}
function timeOutLogAsync(millseconds){
    return (callback)=>{
        setTimeout(callback,millseconds);
    }
}
const gen = buildGen();
console.log(`now:${Date.now()},generator is init`);
var next = gen.next();
next.value(function(){
    console.log(`now:${Date.now()},first setTimeout callback`);
    next = gen.next();
    next.value(function(){
        console.log(`now:${Date.now()},sencond setTimeout callback`);
    });
});

function run(generator){
    const gen = generator();
    function next(value){
        let next = gen.next(value);
        if(next.done){
            return;
        }
        next.value(next);
    }
    next();
}
run(buildGen);