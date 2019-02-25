import { Component,ViewChild, ElementRef } from '@angular/core';
import {LabelAuditive} from '../label-auditive'
import {TranscripterService} from '../../core/transcripter/transcripter.service'
import {TalkerService} from '../../core/talker/talker.service'
@Component({
  selector: 'app-label',
  templateUrl: '../label.html',
  styleUrls: ['../label.css']
})
export class LabelComponent implements LabelAuditive {
  //  Service access
  static talker : TalkerService;
  static transcripter : TranscripterService;
  // Class properties
  _initials :string;
  // Plot info's
  _y  : number;
  _x  : number;
  _z  : number;
  number: number;
  sounds : string[] = new Array<string>();
  computedStyle
  constructor() {}
  style() : any{
    let bottom = this._y+'%';
    let left = this._x+'%';
    if(this._y >= 97)
      bottom = 'calc('+this._y+'% - 45px)';
    else if(this._y >= 3)
      bottom = 'calc('+this._y+'% + 45px)';
    if(this._x >= 97)
      left = 'calc('+this._x+'% - 45px)';
    else if(this._x >= 3)
      left = 'calc('+this._x+'% + 45px)';
    return {'bottom': bottom, 'left': left};
  }
  class() : any{
    return ["atom", this._initials]
  }
  get initials() : string{
  return this._initials;
  }  
  get position() : number[]{
    return [this._x,this._y];
  }
  get upSound() : string{
    return this.sounds[1];
  }
  get downSound() : string{
    return this.sounds[0];
  }
  set initials(initials:string){
    this._initials = initials;
  }
  set position(positions : number[]){
    this._x = positions[0];
    this._y = positions[1];
  }  
  set upSound(upSound:string){
    this.sounds[1] = upSound;
  }
  set downSound(downSound:string){
    this.sounds[0] = downSound;
  }
  decideSound(event : any){
    if(event.keyCode == 9){ // Tabkey
      if(event.shiftKey) // Shiftkey AND tabKey
        return this.speak(this.sounds[0]);
     return this.speak(this.sounds[1]);
  }
}
  speak(message:string) : void{
    TalkerService.speak(message);
  }
}