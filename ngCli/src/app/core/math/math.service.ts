import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MathService {

  /**
   * It returns the degrees of the triangle.
   * It needs the position of two points, pos1 and pos2, and returns the degree of the triangle made by the two points
   *
   * @param {Array<number>} pos The position of the first amino.
   * @param {Array<number>} pos2 The position of the second amino.
   * @returns {Object} The degrees.
   * @memberof TranscripterService
   */
  getDegrees(pos:Array<number>, pos2:Array<number>) : Object{
    let deltaX = this.getDelta(pos[0] , pos2[0]);
    let deltaY = this.getDelta(pos[1] , pos2[1]);
    let degree = Math.abs(deltaY) / Math.abs(deltaX);
    degree = Math.atan(degree) * 180 / Math.PI;
    degree = Math.abs(degree);
    const degrees = {
      'xAxis':degree,
      'yAxis':(90 - degree)
    };
    return {"xAxis" : degrees["yAxis"], "yAxis" : degrees["xAxis"]};
    }
    getHypotenuse(pos:Array<number>, pos2:Array<number>): number{
      let deltaX = this.getDelta(pos[0] , pos2[0]);
      let deltaY = this.getDelta(pos[1] , pos2[1]);
      let result = Math.pow(deltaX,2 ) + Math.pow(deltaY,2);
      return Math.sqrt(result);
    }
    getQuadrant(pos:number[], posRelative: number[]) : number{ // Pega o quadrante do PRIMEIRO parâmetro em  relação ao SEGUNDO
      let posX = this.getDelta(pos[0],posRelative[0]);
      let posY = this.getDelta(pos[1],posRelative[1]);
      switch(true){
        case (posX > 0 && posY > 0):
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
    round(val:number) : number{
      return Math.round(val / 10 ) * 10 
    }
    
    getDelta(val:number,val2:number) : number{
      return val2 - val;
    }
    toHour(degree: number): number[]{
      let aux = (degree/30);
      let hour = Math.trunc(aux);
      let min = Math.trunc( (aux - hour)*60) ;
      min = (this.round( Math.trunc(min) ))  
      if (min == 60){min = 0; hour++;}
      return [hour,min];
    }
    getDegreeOnQuadrant(degree:number,quadrant:number){
      let auxMult : number;
      switch(quadrant){
        case (1) : auxMult = 0 ;break; 
        case (2) : auxMult = 3; break;
        case (3) : auxMult = 2;break;
        case (4) : auxMult = 1; break;
      }
    return degree + (auxMult * 90);
  }
  getCorrectDegree(actual: number[],predecessor: number[],quadrants:Object,degrees:Object){
    let result ;
    if (actual[0] > predecessor[0])
      result = {
        'actual': this.getDegreeOnQuadrant(degrees['xAxis'],quadrants['actual']),
        'predecessor': this.getDegreeOnQuadrant(degrees['xAxis'],quadrants['pred'])
      };
    else
    result = {
      'actual': this.getDegreeOnQuadrant(degrees['yAxis'],quadrants['actual']),
      'predecessor': this.getDegreeOnQuadrant(degrees['yAxis'],quadrants['pred'])
    };
    return result;
  }
  }
