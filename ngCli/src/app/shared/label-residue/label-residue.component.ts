import { Component, EventEmitter,Output} from '@angular/core';
import { LabelAuditive } from '../../shared/label-auditive';
import { LabelComponent } from '../label/label.component'
@Component({
  selector: 'app-label-residue',
  templateUrl: '../label.html',
  styleUrls: ['../label.css']
})

export class LabelResidueComponent extends LabelComponent implements  LabelAuditive {

  @Output() openModal: EventEmitter<any> = new EventEmitter();

  //  Structure info's
  _isFirst : boolean = false;
  _isLast : boolean = false;
  _isFirstHelix: boolean= false;
  _isLastHelix: boolean= false;
  _isHelix: boolean= false;
  _isSheet: boolean= false;
  _isFirstSheet: boolean= false;
  _isLastSheet: boolean = false;
  //  Sound message text
  //  Parent ref for modal ~ Need improvement...
  _parent : any;
  
  decideSound(event : any){
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
        return this.speak(message)
      }
      if(event.keyCode == 81) // Letter 'Q'
        return this.openModal.emit({parent : this._parent,initials:this.initials})
      else
        super.decideSound(event)
    }
  
}