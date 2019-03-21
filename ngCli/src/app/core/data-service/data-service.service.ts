import { Injectable } from '@angular/core';
import { Protein } from '../../shared/protein';
import { Label} from '../../shared/label'
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { Aminoacid } from '../../shared/aminoacid';
@Injectable()
export class DataService {
  private proteinData : BehaviorSubject<Protein> = new BehaviorSubject<Protein>(undefined);
  currentProtein = this.proteinData.asObservable();
  setProtein(protein) { 
    protein['residues'] = this.parseTag(protein['residues'],protein['residue_num']);
    this.proteinData.next( new Protein( protein['identifier'],
                                        protein['authors'],
                                        protein['experiment'],
                                        protein['classification'],
                                        protein['deposition_date'],
                                        protein['version'],
                                        protein['residues'],
                                        protein['alpha_loc'],
                                        protein['helix_range'],
                                        protein['sheet_range']));  
  }
  getProtein(): Protein{
    return this.proteinData.getValue();
  }
  parseTag(residues:string[], residues_num:number[]):Label[]{
    let residuesComp : Label[] = [];
    for(let i = 0 ; i <residues.length; i++)
      residuesComp.push({initials: residues[i], number: residues_num[0]+i});
    return residuesComp;
  }
  parseAminoData(){
    const protein = this.proteinData.getValue();
    let aminoData = Array<Aminoacid>();
    const amountRes = protein['residues'].length
    const hasHelix = protein['helix_range'].length > 0;
    const hasSheet =  protein['sheet_range'].length > 0;
    let actualHelix = 0;
    let actualSheet = 0;
    for(let x = 0; x < amountRes;x++){
      aminoData[x] = new Aminoacid();
      aminoData[x]._name = protein['residues'][x]['initials'];
      aminoData[x]._isFirst = x == 0;
      aminoData[x]._isLast = x == amountRes-1;
      const pos = protein.alphaLoc;
      aminoData[x]._x = pos[x][0]
      aminoData[x]._y = pos[x][1];
      aminoData[x]._z = pos[x][2];
      if(hasHelix && actualHelix < protein['helix_range'].length){
        aminoData[x]._isHelix = protein['helix_range'][actualHelix][1] > protein['residues'][x]['number'] > protein['helix_range'][actualHelix][0]
        aminoData[x]._isFirstHelix = protein['residues'][x]['number'] == protein['helix_range'][actualHelix][0];
        aminoData[x]._isLastHelix = protein['residues'][x]['number'] == protein['helix_range'][actualHelix][1];
        if(aminoData[x]._isLastHelix)
          actualHelix++;
      }
      if(hasSheet && actualSheet < protein['sheet_range'].length){
        aminoData[x]._isSheet = protein['sheet_range'][actualSheet][1] > protein['residues'][x]['number'] > protein['sheet_range'][actualSheet][0]
        aminoData[x]._isFirstSheet = protein['residues'][x]['number'] == protein['sheet_range'][actualSheet][0];
        aminoData[x]._isLastSheet = protein['residues'][x]['number'] == protein['sheet_range'][actualSheet][1];
        if(aminoData[x]._isLastSheet)
          actualSheet++;
      }
      
    }
    return aminoData;
  }
}