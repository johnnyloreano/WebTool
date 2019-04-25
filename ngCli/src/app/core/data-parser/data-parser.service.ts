import { Injectable } from '@angular/core';
import { DataService} from '../data-service/data-service.service';
import { Aminoacid } from '../../interfaces/aminoacid';
import { TestPoint } from '../../interfaces/testPoint';
import { TranscripterService } from '../transcripter/transcripter.service';
import { MathService } from '../math/math.service';
@Injectable({
  providedIn: 'root'
})
export class DataParserService {
  constructor(private _dataService : DataService, private _transcripter: TranscripterService, private _math : MathService) { }

  parseStructureInfo(){
    const protein = this._dataService.getProtein();
    return {'helix':protein['helix_range'],
            'sheet':protein['sheet_range']}
  }
  parseAminoData(){
    const protein = this._dataService.getProtein();
    let aminoData = Array<Aminoacid>();
    const resLen = protein['residues'].length
    const hasHelix = protein['helix_range'].length > 0;
    const hasSheet =  protein['sheet_range'].length > 0;
    let actualHelix = 0;
    let actualSheet = 0;
    for(let x = 0; x < resLen;x++){
      aminoData[x] = new Aminoacid();
      aminoData[x].name = protein['residues'][x]['initials'];
      aminoData[x]._isFirst = x == 0;
      aminoData[x]._isLast = x == resLen-1;
      const pos = protein.alphaLoc;
      aminoData[x].x = pos[x][0]
      aminoData[x].y = pos[x][1];
      aminoData[x].z = pos[x][2];
      if(hasHelix && actualHelix < protein['helix_range'].length){
        aminoData[x]._isHelix = (protein['helix_range'][actualHelix][1] > protein['residues'][x]['number'] )&&(protein['residues'][x]['number'] > protein['helix_range'][actualHelix][0])
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
      aminoData[x].index = x;
      aminoData[x]._genInfo = this.parserGenAminoInfo(aminoData[x]);
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
  public getStart(){
   let data;
   data = this._dataService.getProtein();
   let message;
   if(data != undefined){
      switch(this._math._getQuadrant([data.alphaLoc[0][0],data.alphaLoc[0][1]],50)) {
         case 1:message = "Superior Direito";
         case 2:message = "Superior Esquerdo";
         case 3:message = "Inferior Esquerdo";
         case 4:message = "Inferior Direito";
      } 
   }
   else{
      data = this._dataService.getTest();
      switch( this._math._getQuadrant([data.pointLoc[0][0],data.pointLoc[0][1]],2.5) ) {
         case 1:message = "Superior Direito";
         case 2:message = "Superior Esquerdo";
         case 3:message = "Inferior Esquerdo";
         case 4:message = "Inferior Direito";
      } 
   }
   return message;
  }
  private parserGenAminoInfo(amino : Aminoacid){
    let message = 'Posição atual: ' + this.getAminoName(amino.name);
      if (amino._isFirst) {
         message += '. Primeiro resíduo';
      } else if (amino._isLast) {
         message += '. Último resíduo';
      }
      if (amino._isFirstHelix) {
         message += '. Início de Hélice';
      } else if (amino._isLastHelix) {
         message += '. Fim de Hélice';
      } else if (amino._isHelix) {
         message += '. Dentro de Hélice';
      }
      if (amino._isFirstSheet) {
         message += '. Início de Fita';
      } else if (amino._isLastSheet) {
         message += '. Fim de Fita';
      } else if (amino._isSheet) {
         message += '. Dentro de Fita';
      }
      return message;
   }
  private getTransitions(firstPoint:any,secondPoint:any){
    const position01 = [firstPoint.x, firstPoint.y, firstPoint.z];
    const position02 = [secondPoint.x, secondPoint.y, firstPoint.z];
    return this._transcripter.getTransition(position01,position02);
  }
  private getAminoName(AminoName) {
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
  parseTest(){
    const test = this._dataService.getTest();
    let testData = Array<TestPoint>();
    const valuesLoc = test.pointLoc
    for(let x = 0 ; x < valuesLoc.length;x++){
      testData[x] = new TestPoint();
      testData[x].x = valuesLoc[x][0]
      testData[x].y = valuesLoc[x][1]
      testData[x].z = valuesLoc[x][2]
      if(x > 0){
        const trans = this.getTransitions(testData[x],testData[x-1])
        testData[x]._downSound = trans[1];
        testData[x-1]._upSound = trans[0];
    }
  }  
  testData[0]._downSound = "Você saiu da figura!"
  testData[valuesLoc.length-1]._upSound = testData[0]._downSound
    return testData;
  }
}