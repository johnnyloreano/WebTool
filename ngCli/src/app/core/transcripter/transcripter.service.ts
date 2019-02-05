import { Injectable, ɵConsole } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TranscripterService {
  constructor() { }
  getAdjDegree(pos1:Array<number>, pos2:Array<number>) : number{
  let val = (pos2[1] - pos1[1]) / (pos2[0] - pos1[0]); // tangente
  val = Math.atan(val) * 180 / Math.PI;
  val = Math.abs(val);

  return Math.trunc(val);
  }
  getOppDegree(pos1:Array<number>, pos2:Array<number>) : number{

    return 90 - this.getAdjDegree(pos1,pos2);
  }
  toHour(degree: number): number[]{
    let aux = (degree/30);
    let hour = Math.trunc(aux);
    let min = Math.trunc( (aux - hour)*60) ;
    min = (this.round( Math.trunc(min) ))  
    if (min == 60){min = 0; hour++;}
    console.log(min)
    return [hour,min];
  }
  round(val:number) : number{
    return Math.round(val / 5 ) * 5 
  }
  getDelta(val:number,val2:number) : number{
    return val2 - val;
  }
  getQuadrant(pos:number[], posRelative: number[]) : number{ // Pega o quadrante do PRIMEIRO parâmetro em  relação ao SEGUNDO
    let posX = this.getDelta(pos[0],posRelative[0]);
    let posY = this.getDelta(pos[1],posRelative[1]);
    switch(true){
      case (posX > 0 && posY > 0): //
        return 1;
      case (posX < 0 && posY > 0): //
        return 2
      case (posX < 0 && posY < 0): //
        return 3;
      case (posX > 0 && posY < 0): //
        return 4;
      default:
        return 0;
    }
  }
getDegreeOnQuadrant(degree:number,quadrant:number){
      let auxMult : number;
      switch(quadrant){
        case (1) : auxMult = 0 ;break; 
        case (2) : auxMult = 3; break;
        case (3) : auxMult = 2;break;
        case (4) : auxMult = 1; break;
      }
    return Math.abs(degree + (auxMult * 90));
  }
  createText(hour: number, minutes: number) : string{
    let text:string = "";
    //Casos isolados
      if(hour == 0 || hour == 12){return "Subindo";}
      else if(hour == 3 && minutes == 0){console.log(hour);return "Indo para a direita";}
      else if(hour == 9 && minutes == 0) {return "Indo para a esquerda";}
      else if(hour == 6 && minutes == 0){return "Descendo";}
    //Casos comuns
    else {   
    switch(true){
      case (hour <= 2 || hour >= 11 ):
      text = "Subindo ";
      break;
      case (hour > 2 && hour <= 5):
      text = "Indo para a direita "
      break;
      case (hour > 5 && hour <= 8):
      text = "Descendo "
      break;
      case (hour > 8 && hour < 11):
      text = "Indo para a esquerda "
      break;
    }
  }
    if(hour != 0 && minutes != 0){
    text += hour + " horas e ";
    text += minutes + " minutos"; 
    }
    else if(hour != 0)
    text += hour + " horas";
    else
    text += minutes + " minutos";     
    return text;
  }
  getTransition(pos:number[], pos2:number[]){//Retorna os dados para o feedback sonoro. Pos é o ATUAL, e pos2 é o ANTERIOR A ELE
    let degrees = [ this.getAdjDegree(pos,pos2),// Grau de POS
                    this.getOppDegree(pos2,pos)]; // Grau de POS2
    let quadrants = [ this.getQuadrant(pos2,pos),
                      this.getQuadrant(pos,pos2)]; // quadrants[0] = quadrante de pos2, quadrants[1] = quadrante de pos
    let calculateDegrees = [  this.getDegreeOnQuadrant(degrees[0],quadrants[0]),
                              this.getDegreeOnQuadrant(degrees[1],quadrants[1])];
    let hours = [ this.toHour(calculateDegrees[0]), 
                  this.toHour(calculateDegrees[1]) ]
    let message = [ this.createText(hours[0][0],hours[0][1]),
                    this.createText(hours[1][0], hours[1][1]) ];
      console.log(message);
      console.log(degrees);
      console.log(calculateDegrees);
    return message;
  }
}
