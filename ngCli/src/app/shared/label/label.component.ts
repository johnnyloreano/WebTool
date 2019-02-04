import { Component, OnInit, Input,Output, EventEmitter} from '@angular/core';
import {LabelAuditive} from '../label-auditive'
import {TranscripterService} from '../../core/transcripter/transcripter.service'
import {TalkerService} from '../../core/talker/talker.service'
@Component({
  selector: 'app-label',
  template: `
              <div tabindex="0" class="d-inline-block text-center label" [ngStyle]="getPosition()" >
                {{_initials}}
              </div>
              `,
  styleUrls: ['./label.component.css']
})
export class LabelComponent implements LabelAuditive {
  //  Service access
  static talker : TalkerService;
  static transcripter : TranscripterService;
  // Class properties
  _initials :string;
  // Plot info's
  _y  : number = undefined;
  _x  : number = undefined;
  _style ;
  _class;
  sounds : string[];
  get initials() : string{
  return this.initials;
  }  
  get style() : any{
    return this.style;
  }
  get class() : any{
    return this._class
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
    this._y = positions[1];
    this._x = positions[0];
  }  
  set upSound(upSound:string){
    this.sounds[1] = upSound;
  }
  set downSound(downSound:string){
    this.sounds[0] = downSound;
  }
  getPosition(){
    return {'position':'absolute', 'bottom': this._y+"%", 'left': this._x+"%" };
  }
  decideSound(event : any){
    if(this.sounds[0] != undefined || this.sounds[1] != undefined) 
    if(event.keyCode == 9){ // Tabkey
      if(event.shiftKey) // Shiftkey AND tabKey
        return this.speak(this.sounds[0]);
     return this.speak(this.sounds[1] );

  }
}
  speak(message:string) : void{
    TalkerService.speak(message);
  }
}