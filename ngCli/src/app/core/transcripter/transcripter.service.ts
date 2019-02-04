import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TranscripterService {

  constructor() { }
  getTan(pos1:Array<number>, pos2:Array<number>) : number{ 
    let val = (pos2[1] - pos1[1]) / (pos2[0] - pos1[0]);
    return val;
  }
  getDegree(pos1:Array<number>, pos2:Array<number>) : number{
  let val = this.getTan(pos1,pos2);
  let valInv = 1 / val;
  val = Math.atan(val) * 180 / Math.PI;
  valInv = Math.atan(valInv) * 180 / Math.PI
    return Math.trunc(Math.abs(val)) ;
  }
  getInverseDegree(pos1:Array<number>, pos2:Array<number>) : number{
    return Math.abs(this.getDegree(pos1,pos2) - 90 )
  }
  toHour(degree: number): number[]{
    let aux = (degree/30);
    let hour = Math.trunc(aux);
    let min = (aux - hour) * 0.6;
    min = (this.round(Math.trunc(min * 100))) / 100 
    if (min == .6){
      min = 0; hour++;
    }
    let val = new Date();
    val.setHours(hour);
    val.setMinutes(min*100)
    return [hour,min];
  }

  round(val:number) : number{
    let newVal = Math.round(val / 10 )
    newVal *= 10
    return newVal 
  }

  getDelta(val:number,val2:number) : number{
    return val2 - val;
  }

  getQuadrant(pos:number[], posRelative: number[]) : number{ // Pega o quadrante do SEGUNDO parâmetro
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

  getCalculateDegree(degree:number,quadrant:number){
      let auxMult;
      switch(quadrant){
      case (1) : auxMult = 0 ;break; 
      case (2) : auxMult = 3; break;
      case (3) : auxMult = 2;break;
      case (4) : auxMult = 1; break;
      }
    return degree + (auxMult * 90);
  }

  createText(hour: number, minutes: number) : string{
    let text:string = "";
    //Casos isolados
    if(hour == 0 || hour == 12)
      return "Subindo";
    if(hour == 3)
      return "Indo para a direita"
    if(hour == 9)
      return "Indo para a esquerda"
    if(hour == 6)
      return "Descendo";
    //Casos comuns
    else {   
    switch(true){
      case (hour <= 2 || hour >= 11):
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
    text += hour + " horas e ";
    text += 100*minutes + " minutos";
    
    return text;
  }

  getTransition(pos:number[], pos2:number[]){//Retorna os dados para o feedback sonoro

    let degrees = [ this.getDegree(pos,pos2),
                    this.getInverseDegree(pos2,pos)]; // degrees[0] = grau usando eixo x de pos, degrees[1] = grau usando eixo x de pos2
    let quadrants = [ this.getQuadrant(pos,pos2),
                      this.getQuadrant(pos2,pos)]; // quadrants[0] = quadrante de pos, quadrants[1] = quadrante de pos2
    let calculateDegrees = [  this.getCalculateDegree(degrees[0],quadrants[0]),
                              this.getCalculateDegree(degrees[0],quadrants[1])];
    let hours = [ this.toHour(calculateDegrees[0]), 
                  this.toHour(calculateDegrees[1]) ]
    let message = [ this.createText(hours[0][0],hours[0][1]),
                    this.createText(hours[1][0], hours[1][1]) ];

    return message;
  }
}
