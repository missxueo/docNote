class Person{
    static style:string = "human";
    style:string = "child";
}
let p = new Person();
console.log(Person.style === p.style);