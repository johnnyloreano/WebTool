import { Component, EventEmitter, Output} from '@angular/core';
import { LabelComponent } from '../label/label.component';
@Component({
  selector: 'app-label-residue',
  templateUrl: '../label.html',
  styleUrls: ['../label.css']
})

export class LabelResidueComponent extends LabelComponent {

  @Output() openModal: EventEmitter<any> = new EventEmitter();

  _class: string[] = ['label'];
  //  Structure info's
  _isFirst = false;
  _isLast = false;
  _isFirstHelix = false;
  _isLastHelix = false;
  _isHelix = false;
  _isSheet = false;
  _isFirstSheet = false;
  _isLastSheet = false;
  //  Sound message text
  //  Parent ref for modal ~ Need improvement...
  _parent: any;
  class() {
    return ['label'];
  }
  event(event) {
      if (event.keyCode === 32) { // Spacekey
        let message = 'Posição atual: ' + this.getAminoName(this.initials);
        if (this._isFirst) {
        message += '. Primeiro resíduo';
        } else if (this._isLast) {
          message += '. Último resíduo';
        }if (this._isFirstHelix) {
        message += '. Início de Hélice';
        } else if (this._isLastHelix) {
        message += '. Fim de Hélice';
        } else if (this._isHelix) {
        message += '. Dentro de Hélice';
        }
        if (this._isFirstSheet) {
          message += '. Início de Fita';
        } else if (this._isLastSheet) {
          message += '. Fim de Fita';
        } else if (this._isSheet) {
          message += '. Dentro de Fita';
        }
        return this.speak(message);
      } else {
      // if (event.keyCode === 81) { // Letter 'Q'
      //   return this.openModal.emit({parent : this._parent, initials: this.initials});
    /*}*/super.decideSound(event);
      }
    }
    getAminoName(AminoName) {
      switch (AminoName) {
        case 'PHE':
          return 'Fenilalanina';
        case 'ALA':
          return 'Alanina';
        case 'MET':
          return 'Metionina';
        case 'LYS':
          return 'Lisina';
        case 'GLU':
          return 'Glutamina';
        case 'PRO':
          return 'Prolina';
        case 'SER':
          return 'Serina';
        case 'LEU':
          return 'Leucina';
          case 'ILE':
          return 'Isoleucina';
          case 'THR':
          return 'Treonina';
          case 'CYS':
          return 'Cisteína';
          case 'TYR':
          return 'Tirosina';
          case 'ASN':
          return 'Asparagina';
          case 'GLN':
          return 'Glutamina';
          case 'GLU':
          return 'Ácido Glutâmico';
          case 'ARG':
          return 'Arginina';
          case 'HYS':
          return 'Histidina';
          case 'TRP':
          return 'Triptofano';
          case 'ASP':
          return 'Ácido Aspártico';
          case 'GLY':
          return 'Glicina';
      }
    }
}
