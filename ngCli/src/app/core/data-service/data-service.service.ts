import { Injectable } from '@angular/core';
import { Protein } from '../../interfaces/protein';
import { Label} from '../../interfaces/label'
import { Test} from '../../interfaces/test'
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
@Injectable()
export class DataService {
  private proteinData : BehaviorSubject<Protein> = new BehaviorSubject<Protein>(undefined);
  private testData : BehaviorSubject<Test> = new BehaviorSubject<Test>(undefined);
  currentProtein = this.proteinData.asObservable();
  currentTest = this.testData.asObservable();
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
                                        protein['sheet_range'],
                                        protein['title']));  
  }
  setTest(test){
    this.testData.next(new Test(
      test['identifier'], test['authors'],test['pointLoc'],test['title']
    ))
  }
  getTest(): Test{
    return this.testData.getValue();
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
}