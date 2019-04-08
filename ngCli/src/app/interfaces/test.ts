
export class Test {
    private _identifier : string;
    private _authors: string[];
    private _pointLoc : Array<any>;
    private _title : string;
    private x? : number;
    private y? : number;
    private z? : number;
    constructor(identifier:string,authors:string[], pointLoc: Array<any>,
                title: string){
        this._identifier = identifier;
        this._pointLoc = pointLoc;
        this._authors = authors;
        this._title = title;
    }
    get identifier(): string{
        return this._identifier
    } 
    get authors(): string[]{
        return this._authors;
    } 
    get title() : string{
        return this._title;
    }
    get pointLoc(): Array<any>{
        return this._pointLoc;
    }
    set _x(_x:number){
        this.x = _x;
    }
    set _y(_y:number){
        this.x = _y;
    }
    set _z(_z:number){
        this.x = _z;
    }
}