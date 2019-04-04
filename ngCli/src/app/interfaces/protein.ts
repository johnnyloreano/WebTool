import { Label } from "./label";

export class Protein {
    private _identifier : string;
    private _authors: string[];
    private _experiment: string;
    private _classification : string;
    private _dep_date:string;
    private _version : string;
    private _residues : Array<Label>;
    private _alphaLoc : Array<any>;
    private _helix_range : Array<any>;
    private _sheet_range : Array<any>;
    private _title : string;
    constructor(identifier:string,authors:string[],experiment:string,classification:string,
                dep_date:string,version:string,residues : Array<any>, alphaLoc: Array<any>,
                helix_range: Array<any>, sheet_range: Array<any>, title: string){
        this._identifier = identifier;
        this._authors = authors;
        this._experiment = experiment;
        this._classification = classification;
        this._dep_date = dep_date;
        this._version = version;        
        this._residues = residues;
        this._alphaLoc = alphaLoc;
        this._helix_range = helix_range;
        this._sheet_range = sheet_range;
        this._title = title;
    }
    get identifier(): string{
        return this._identifier
    } 
    get authors(): string[]{
        return this._authors;
    } 
    get experiment(): string{
        return this._experiment;
    } 
    get classification(): string{
        return this._classification
    } 
    get dep_date(): string{
        return this._dep_date
    } 
    get residues(): Label[]{
        return this._residues
    } 
    get version(): string{
        return this._version
    }
    get alphaLoc(): Array<any>{
        return this._alphaLoc;
    }
    get helix_range(): Array<any>{
        return this._helix_range
    }
    get sheet_range(): Array<any>{
        return this._sheet_range;
    }    
    get title(): string{
        return this._title;
    }
}