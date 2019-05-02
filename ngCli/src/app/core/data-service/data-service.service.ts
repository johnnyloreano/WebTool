import { Injectable } from '@angular/core';
import { Protein } from '../../interfaces/protein';
import { Test} from '../../interfaces/test'
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { Aminoacid } from '../../interfaces/aminoacid';
@Injectable()
export class DataService {
  private proteinData : BehaviorSubject<Protein> = new BehaviorSubject<Protein>(undefined);
  private testData : BehaviorSubject<Test> = new BehaviorSubject<Test>(undefined);
  private seletorData : BehaviorSubject<string> = new BehaviorSubject<string>(undefined);
  currentProtein = this.proteinData.asObservable();
  currentTest = this.testData.asObservable();
  setProtein(protein) {
    protein['residues'] = this.parseAmino(protein['residues']);
    this.proteinData.next( new Protein( protein['name'],
                                        protein['title'],
                                        protein['authors'],
                                        protein['experiment'],
                                        protein['classification'],
                                        protein['deposition_date'],
                                        protein['version'],
                                        protein['residues'])
                                        );
    }
  setTest(test){
    this.testData.next(new Test(
      test['identifier'], test['authors'],test['pointLoc'],test['title']
    ))
  }
  setSeletor(value:string){
    this.seletorData.next(value);
  }
  getSeletor() : string{
    return this.seletorData.getValue();
  }
  getTest(): Test{
    return this.testData.getValue();
  }
  getProtein(): Protein{
    return this.proteinData.getValue();
  }
  getResidues(): Aminoacid[]{
    return this.getProtein['residues']
  }
  parseAmino(residues:any[]):Aminoacid[]{
    let residuesComp = new Array<Aminoacid>();
    for(let i = 0 ; i <residues.length; i++){
      const nAmino = new Aminoacid();
      nAmino.index = i;
      nAmino.name = residues[i]['init'];
      nAmino.upSound = residues[i]['upSound'];
      nAmino.downSound = residues[i]['downSound'];
      nAmino.message = residues[i]['message'];
      const loc = residues[i]['location']
      nAmino.x = loc[0]
      nAmino.y = loc[1]
      nAmino.z = loc[2]
      residuesComp.push(nAmino)
    }
    console.group(residuesComp)
    return residuesComp;
  }
}