import { Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { Protein } from '../../interfaces/protein';
import { Points } from '../../interfaces/points';
import { TestGraphic } from '../../interfaces/testGraphic';
@Injectable()
export class DataService {
  private proteinData : BehaviorSubject<Protein> = new BehaviorSubject<Protein>(undefined);
  private testData : BehaviorSubject<TestGraphic> = new BehaviorSubject<TestGraphic>(undefined);
  private seletorData : BehaviorSubject<string> = new BehaviorSubject<string>(undefined);
  setProtein(protein) {
    protein['residues'] = this.parseAmino(protein['residues']);
    this.proteinData.next( new Protein( protein['identifier'],
                                        protein['title'],
                                        protein['author'],
                                        protein['version'],
                                        protein['date'],
                                        protein['experiment'],
                                        protein['residues'])
                                        );
    }
  setTest(test){
    this.testData.next( 
      new TestGraphic(
        this.parsePTest(test['pTest']
        ) ) );
  }
  setSeletor(value:string){
    this.seletorData.next(value);
  }
  getSeletor() : string{
    return this.seletorData.getValue();
  }
  getTest(): TestGraphic{
    return this.testData.getValue();
  }
  getProtein(): Protein{
    return this.proteinData.getValue();
  }
  getResidues(): Points[]{
    if(this.getProtein() == undefined || this.getProtein() == null)
      return null
    return this.getProtein()['residues']
  }
  parseAmino(residues:any[]):Points[]{
    let residuesComp = new Array<Points>();
    for(let i = 0 ; i <residues.length; i++){
      const nAmino = new Points();
      nAmino.index = i;
      nAmino.label = residues[i]['label'];
      nAmino.transition = residues[i]['transition'];
      nAmino.message = residues[i]['message'];
      const loc = residues[i]['location']
      nAmino.x = loc[0]
      nAmino.y = loc[1]
      nAmino.z = loc[2]
      residuesComp.push(nAmino)
    }
    // residuesComp.forEach(element => {console.log(element);});
    return residuesComp;
  }
  parsePTest(pTest: any[]){

    const pTestArr = new Array<Points>();
    for(let x = 0; x < pTest.length;x++){
      let tp = new Points();
      tp.index = x;
      tp.label = String(x+1);
      tp.transition = pTest[x]['transition'];
      tp.message = pTest[x]['message'];
      const coords = pTest[x]['location'];
      tp.x = coords[0];
      tp.y = coords[1];
      pTestArr.push(tp);
    }
    return pTestArr;
  }
}