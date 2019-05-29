import { Injectable, ɵConsole } from '@angular/core';
import { Protein } from '../../interfaces/protein';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { Test} from '../../interfaces/test';
import { Aminoacid } from '../../interfaces/aminoacid';
import { TestPoint } from '../../interfaces/testPoint';
@Injectable()
export class DataService {
  private proteinData : BehaviorSubject<Protein> = new BehaviorSubject<Protein>(undefined);
  private testData : BehaviorSubject<Test> = new BehaviorSubject<Test>(undefined);
  private seletorData : BehaviorSubject<string> = new BehaviorSubject<string>(undefined);
  private startData : BehaviorSubject<string> = new BehaviorSubject<string>(undefined);
  setProtein(protein) {
    this.startData.next(protein['start']);
    protein['residues'] = this.parseAmino(protein['residues']);
    this.proteinData.next( new Protein( protein['name'],
                                        protein['title'],
                                        protein['authors'],
                                        protein['version'],
                                        protein['deposition_date'],
                                        protein['experiment'],
                                        protein['residues'])
                                        );
    }
  setTest(test){
    this.startData.next(test['start']);
    test['pTest'] = this.parsePTest(test['pTest']);
    this.testData.next(new Test(
      test['pTest']
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
    return this.getProtein()['residues']
  }
  getStart(){
      return this.startData.getValue();
  }
  parseAmino(residues:any[]):Aminoacid[]{
    let residuesComp = new Array<Aminoacid>();
    for(let i = 0 ; i <residues.length; i++){
      const nAmino = new Aminoacid();
      nAmino.index = i;
      nAmino.name = residues[i]['init'];
      nAmino.transition = residues[i]['transition'];
      nAmino.message = residues[i]['message'];
      const loc = residues[i]['location']
      nAmino.x = loc[0]
      nAmino.y = loc[1]
      nAmino.z = loc[2]
      residuesComp.push(nAmino)
    }
    return residuesComp;
  }
  parsePTest(pTest: any[]){
    const pTestArr = new Array<TestPoint>();
    for(let x = 0; x < pTest.length;x++){
      let tp = new TestPoint();
      tp.index = x;
      tp.downSound = pTest[x]['downSound'];
      tp.upSound = pTest[x]['upSound'];
      const coords = pTest[x]['coords'];
      tp.x = coords[0];
      tp.y = coords[1];
      pTestArr.push(tp);
    }
    return pTestArr;
  }
}