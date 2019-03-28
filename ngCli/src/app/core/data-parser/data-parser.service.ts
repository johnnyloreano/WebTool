import { Injectable } from '@angular/core';
import { DataService} from '../data-service/data-service.service';
import { Aminoacid } from '../../interfaces/aminoacid';
import { TranscripterService } from '../transcripter/transcripter.service';
@Injectable({
  providedIn: 'root'
})
export class DataParserService {
  private protein;
  constructor(private _dataService : DataService, private _transcripter: TranscripterService) { }

  parseAminoData(){
    this.protein = this._dataService.getProtein();
    let aminoData = Array<Aminoacid>();
    const resLen = this.protein['residues'].length
    const hasHelix = this.protein['helix_range'].length > 0;
    const hasSheet =  this.protein['sheet_range'].length > 0;
    let actualHelix = 0;
    let actualSheet = 0;
    for(let x = 0; x < resLen;x++){
      aminoData[x] = new Aminoacid();
      aminoData[x].name = this.protein['residues'][x]['initials'];
      aminoData[x]._isFirst = x == 0;
      aminoData[x]._isLast = x == resLen-1;
      const pos = this.protein.alphaLoc;
      aminoData[x].x = pos[x][0]
      aminoData[x].y = pos[x][1];
      aminoData[x].z = pos[x][2];
      if(hasHelix && actualHelix < this.protein['helix_range'].length){
        aminoData[x]._isHelix = (this.protein['helix_range'][actualHelix][1] > this.protein['residues'][x]['number'] )&&(this.protein['residues'][x]['number'] > this.protein['helix_range'][actualHelix][0])
        aminoData[x]._isFirstHelix = this.protein['residues'][x]['number'] == this.protein['helix_range'][actualHelix][0];
        aminoData[x]._isLastHelix = this.protein['residues'][x]['number'] == this.protein['helix_range'][actualHelix][1];
        if(aminoData[x]._isLastHelix)
          actualHelix++;
      }
      if(hasSheet && actualSheet < this.protein['sheet_range'].length){
        aminoData[x]._isSheet = this.protein['sheet_range'][actualSheet][1] > this.protein['residues'][x]['number'] > this.protein['sheet_range'][actualSheet][0]
        aminoData[x]._isFirstSheet = this.protein['residues'][x]['number'] == this.protein['sheet_range'][actualSheet][0];
        aminoData[x]._isLastSheet = this.protein['residues'][x]['number'] == this.protein['sheet_range'][actualSheet][1];
        if(aminoData[x]._isLastSheet)
          actualSheet++;
      }
      aminoData[x].index = x;
      if(x > 0){
        const transitions = this.getTransitions(aminoData[x],aminoData[x-1]);
        aminoData[x]._downSound = transitions[1];
        aminoData[x-1]._upSound = transitions[0];
      }
    }
    aminoData[0]._downSound = "Você saiu da proteína!";
    aminoData[resLen-1]._upSound = "Você saiu da proteína!";
    return aminoData;
  }
  private getTransitions(aminoActual:Aminoacid,aminoPredecessor:Aminoacid){
    const position01 = [aminoActual.x, aminoActual.y];
    const position02 = [aminoPredecessor.x, aminoPredecessor.y];
    return this._transcripter.getTransition(position01,position02);
  }
}