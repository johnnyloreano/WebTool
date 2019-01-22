import { Component, OnInit, Input,Output, EventEmitter} from '@angular/core';
import {LabelAuditive} from '../label-auditive'
import {TranscripterService} from '../../core/transcripter/transcripter.service'
import {TalkerService} from '../../core/talker/talker.service'
@Component({
  selector: 'app-label',
  template: `
              <div tabindex="0" class="d-inline-block text-center" >
                {{name}}
              </div>
              `,
  styleUrls: ['./label.component.css']
})
export class LabelComponent implements LabelAuditive {
  //  Service access
  static talker : TalkerService;
  static transcripter : TranscripterService;
  // Class properties
  private _initials :string;
  private _y  : number = undefined;
  private _x  : number = undefined;

  readonly sounds : string[];
  get initials() : string{
  return this.initials;
  }  
  get style() : any{
    return {'position':'absolute', 'bottom': this._y+"%", 'left': this._x+"%" };
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
  decideSound(event : any){
    if(this.sounds[0] != undefined || this.sounds[1] != undefined) 
    if(event.keyCode == 9){ // Tabkey
      if(event.shiftKey) // Shiftkey AND tabKey
        return this.speak(this.sounds[0]);
     return this.speak(this.sounds[1] );

  }
}
  speak(message:string) : void{
  
  }
}