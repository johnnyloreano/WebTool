import { Aminoacid } from "./aminoacid";

export class Protein {
    private _title : string;
    private _identifier : string;
    private _authors: string[];
    private _experiment: string;
    private _classification : string;
    private _dep_date:string;
    private _version : string;
    private _residues : Array<Aminoacid>;
    constructor(identifier:string,title: string,authors:string[],version:string,dep_date:string,
        experiment:string,residues : Array<any>){
        this._identifier = identifier;
        this._title = title;
        this._authors = authors;
        this._version = version;        
        this._dep_date = dep_date;
        this._experiment = experiment;
        this._residues = residues;
    }
    get identifier(): string{
        return this._identifier
    } 
    get authors(): string[]{
        return this._authors;
    } 
    get experiment(): string{
        return null;
        // return this._experiment;
    } 
    get classification(): string{
        return this._classification
    } 
    get dep_date(): string{
        return this._dep_date
    } 
    get residues(): Aminoacid[]{
        return this._residues
    } 
    get version(): string{
        return this._version
    }    
    get title(): string{
        return this._title;
    }
}