import { Component, OnInit, EventEmitter,Output} from '@angular/core';
import { TalkerService } from '../../core/talker/talker.service'
import { LabelAuditive } from '../../shared/label-auditive';
@Component({
  selector: 'app-auditive-label',
  template: `
              <div (keydown) ='decideSound($event)' tabindex="0" class="d-inline-block text-center label" [ngStyle]="getPosition()" >
                {{_initials}}
              </div>
            `
  ,
  styleUrls: ['../../shared/label/label.component.css']
})
export class AuditiveLabelComponent implements OnInit, LabelAuditive  {
  private _initials:string;
  //  Plot info's
  private _y  : number = undefined;
  private _x  : number = undefined;
  //  Structure info's
  private _isFirst : boolean = false;
  private _isLast : boolean = false;
  private _isFirstHelix: boolean= false;
  private _isLastHelix: boolean= false;
  private _isHelix: boolean= false;
  private _isSheet: boolean= false;
  private _isFirstSheet: boolean= false;
  private _isLastSheet: boolean = false;
  //  Sound message text 
  sounds: string[];
  private _upSound: string = undefined;
  private _downSound: string = undefined;
  //  Parent ref for modal ~ Need improvement...
  private _parent : any;

  @Output() openModal: EventEmitter<any> = new EventEmitter();
  constructor() {}
  
  ngOnInit() {
  }
  set initials(initials:string){
    this._initials = initials
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
    this._isLast = isLast
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
  set parent(parent:any){
    this._parent = parent
  }
  get isLastHelix(){
    return this._isLastHelix
  }
  get isFirstHelix(){
    return this._isFirstHelix
  }
  get isHelix(){
      return this.isHelix
  }
  get isLastSheet(){
    return this.isLastSheet
  }
  get isFirstSheet(){
    return this.isFirstSheet
  }
  get isSheet(){
      return this.isSheet
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
  getPosArray(): Array<number>{
    return [this._x,this._y];
  }
  decideSound(event : any){
    if(this.upSound != undefined || this.downSound != undefined) 
      if(event.keyCode == 9){ // Tabkey
        if(event.shiftKey) // Shiftkey AND tabKey
          return TalkerService.speak(this._downSound);
       return TalkerService.speak(this._upSound );
      }
      if(event.keyCode == 32){ // Spacekey
        let message = "Posição atual: "
        if(this._isFirst)
        message +=". Primeiro resíduo";
        else if(this._isLast)
        message +=". Último resíduo";
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
        return TalkerService.speak(message);
      }
      if(event.keyCode == 81) // Letter 'Q'
        return this.openModal.emit({parent : this._parent,initials:this._initials})
    //return this.speak("Comando desconhecido");
    }
    speak(message){}
}
