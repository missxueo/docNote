class Human{
    static type:number = 0x99;
    talk(){}
}
class Child extends Human{
    show(){
        console.log(`the human type is ${Child.type}`);
    }
}
let c = new Child();
c.show();
let nChild: typeof Human = Child;
let nc = new nChild();
nc.talk();