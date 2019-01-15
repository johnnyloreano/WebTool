import { Component, OnInit, Input, Inject, Injectable} from '@angular/core';
@Component({
  selector: 'app-label',
  template: `
              <div (keydown) ='decideSound($event)' tabindex="0" class="d-inline-block text-center label" 
              [ngStyle]="getPosition()" >
                {{name}}
              </div>
              `,
  styleUrls: ['./label.component.css']
})
export class LabelComponent implements OnInit {
  @Input() name:string;
  private _y  : number;
  private _x  : number;
  private _upSound: string;
  private _downSound: string;
  private _isFirst : boolean = false;
  private _isLast : boolean = false;
  private _isFirstHelix: boolean= false;
  private _isLastHelix: boolean= false;
  private _isHelix: boolean= false;
  private _isSheet: boolean= false;
  private _isFirstSheet: boolean= false;
  private _isLastSheet: boolean = false;
  private ariaDictionary = {
    "ALA":"Alanina A L A",
    "PHE":"Fenilalanina P H E",
    "ASN":"Asparagina A S N",
    "ARG":"Arginina A R G",
    "TYR":"Tirosina T Y R",
    "LEU":"Leucina L E U",
    "CYS":"Cisteina C Y S",
    "ILE":"Isoleucina I L E",
    "GLU":"AcidoGlutamico G L U",
    "SER":"Serina S E R",
    "ASP":"AcidoAspartico A S P",
    "GLY":"Glicina G L Y",
    "VAL":"Valina V A L",
    "PRO":"Prolina P R O",
    "TRP":"Triptofano T R P",
    "MET":"Metionina M E T",
    "TRE":"Treonina T R E",
    "GLN":"Glutamina G L N",
    "LYS":"Lisina L Y S",
    "HYS":"Histidina H Y S",
    "NH2":"NOTSUPPORTED"
  }
  ngOnInit(){}
  getPosArray(): Array<number>{
    return [this._x,this._y];
  }
  getName(){
  return this.name;
  }
  setName(name:any){
    this.name = name;
  }
  setPosition(y:number,x:number){
    this._x = x;
    this._y = y;
  }
  getPosition(){
    return {'position':'absolute', 'bottom': this._y+"%", 'left': this._x+"%" };
  }
  get Position(){
    return "X:"+ this._x+"%"+ "\nY:"+ this._y+"%";
  }
  set upSound(upSound: string){
    this._upSound = upSound;
  }
  set downSound( downSound:string){
    this._downSound = downSound;
  }
  get upSound(): string{
    return this._upSound;
  }
  get downSound():string{
    return this._downSound;
  }
  set isFirst(isFirst: boolean){
    this._isFirst = isFirst
  }
  set isLast(isLast: boolean){
    this.isLast = isLast
  }
  set isFirstHelix(isFirst : boolean){
    this._isFirstHelix = isFirst;
  }
  set isHelix(isHelix : boolean){
    this._isHelix = isHelix;
  }
  set isLastHelix(isLast : boolean){
    this._isLastHelix = isLast;
  }
  set isFirstSheet(isFirst : boolean){
    this._isFirstHelix = isFirst;
  }
  set isSheet(isSheet : boolean){
    this._isSheet = isSheet;
  }
  set isLastSheet(isLast : boolean){
    this._isFirstHelix = isLast;
  }
  decideSound(event : any){
      if(event.keyCode == 9){
        if(event.shiftKey)
         return this.speak(this._downSound);
      return this.speak(this._upSound );
      }
      if(event.keyCode == 32){
        let message = "Posição atual: "+this.ariaDictionary[this.name]
        if(this._isFirst)
        message +=". Primeiro aminoácido";
        else if(this._isLast)
        message +=". Último aminoácido";
        if(this._isFirstHelix)
        message +=". Início de Hélice"
        else if(this._isLastHelix)
        message +=". Fim de Hélice"
        else if(this._isHelix)
        message +=". Dentro de Hélice"
        if(this._isFirstSheet)
        message +=". Início de Fita"
        else if(this._isLastSheet)
        message +=". Fim de Fita"
        else if(this._isSheet)
        message +=". Dentro de Fita"
        return this.speak(message);
      }
    //return this.speak("Comando desconhecido");
    }
  speak(message:string) : void{
    const msg = new SpeechSynthesisUtterance();
    msg.volume = 0.2; // 0 to 1
    msg.rate = .8; // 0.1 to 10
    msg.pitch = 1; // 0 to 2
    msg.text  = message;
    const vvalue = 44;
    const voice = speechSynthesis.getVoices()[vvalue];
    msg.lang = speechSynthesis.getVoices()[vvalue].lang;
  return speechSynthesis.speak(msg);
  }
}