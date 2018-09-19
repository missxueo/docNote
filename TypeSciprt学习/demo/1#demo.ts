class MyText{
    name:string;
    private state:number;
    protected size:number;
}
class TextBlock extends MyText{
    setSize(){
        this.size = 100;
    }
}
const input = new TextBlock();
input.name = "myInput";