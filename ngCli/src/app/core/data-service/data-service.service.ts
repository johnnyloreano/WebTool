import { Injectable } from '@angular/core';
import { Protein } from '../../shared/protein';
import { Label} from '../../shared/label'
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
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
}