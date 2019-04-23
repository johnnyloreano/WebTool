import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MathService {

  constructor() { }
    /**
   * It returns the degrees of the triangle.
   * It needs the position of two points, pos1 and pos2, and returns the degree of the triangle made by the two points
   *
   * @param {Array<number>} actualAmino The position of the first amino.
   * @param {Array<number>} predecessorAmino The position of the second amino.
   * @returns {Object} The degrees.
   * @memberof TranscripterService
   */
  private getDegrees(actualAmino: Array<number>, predecessorAmino: Array<number>): Object {
    const deltaX = this.getDelta(actualAmino[0] , predecessorAmino[0]);
    const deltaY = this.getDelta(actualAmino[1] , predecessorAmino[1]);
    let degree = Math.abs(deltaY) / Math.abs(deltaX);
    if(degree == 0) degree++;
    degree = Math.atan(degree) * 180 / Math.PI;
    degree = Math.abs(degree);
    const degrees = {
      'xAxis': degree,
      'yAxis': 90 - degree
    };
    const aminoDegrees = {
      'actual' : {'xAxis' : degrees['yAxis'], 'yAxis' : degrees['xAxis']},
      'pred' : degrees
    };
    return aminoDegrees;
    }
    // private getDistance(pos1: Array<number>, pos2: Array<number>) {
    //   const deltaX = this.getDelta(pos1[0] , pos2[0]);
    //   const deltaY = this.getDelta(pos1[1] , pos2[1]);
    //   const deltaZ = this.getDelta(pos1[2] , pos2[2]);
    //   let result = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2) + Math.pow(deltaZ, 2));
    //   result = Math.trunc(result); 
    //   return result;
    // }
    private getQuadrant(pos: number[], posRelative: number[]): number {
      const posX = this.getDelta(pos[0], posRelative[0]);
      const posY = this.getDelta(pos[1], posRelative[1]);
      switch (true) {
        case (posX > 0 && posY > 0):
          return 1;
        case (posX < 0 && posY > 0): //
          return 2;
        case (posX < 0 && posY < 0): //
          return 3;
        case (posX > 0 && posY < 0): //
          return 4;
        case (posX == 0 && posY > 0):
          return 2;
        case (posX < 0 && posY == 0):
          return 2;
        case (posX == 0 && posY < 0):
          return 4;
        case (posX > 0 && posY == 0):
          return 4;
        case(posX == 0 && posY == 0):
          return 0;
      }
    }
    public _getQuadrant(pos: number[]) : number{
      switch (true) {
        case (pos[0] > 0 && pos[1] > 0):
          return 1;
        case (pos[0] < 0 && pos[1] > 0): //
          return 2;
        case (pos[0] < 0 && pos[1] < 0): //
          return 3;
        case (pos[0] > 0 && pos[1] < 0): //
          return 4;
      }
    }
    private quadrantObject(actual: number[], pred: number[]): Object {
      return {
        'pred': this.getQuadrant(actual, pred),
        'actual': this.getQuadrant(pred, actual)
      };
    }
    private toHour(degree: number) {
      const aux = (degree / 30);
      let hour = Math.trunc(aux);
      let min = Math.trunc( (aux - hour) * 60) ;
      min =  Math.trunc(min);
      if (min >= 30)
      hour++;
      if (hour == 0)
      hour = 12;
      return hour;
    }  
    private getDelta(val: number, val2: number): number {
      return val2 - val;
    }
  
    private getDegreeOnQuadrant(degree: number, quadrant: number) {
        let auxMult: number;
        switch (quadrant) {
          case (1) : auxMult = 0 ; break;
          case (2) : auxMult = 3; break;
          case (3) : auxMult = 2; break;
          case (4) : auxMult = 1; break;
        }
      return degree + (auxMult * 90);
    }
    private getCorrectDegree(actual: number[], predecessor: number[], quadrants: Object, degrees: Object) {
      let result ;
      if (actual[0] > predecessor[0]) {
        result = {
          'actual': this.getDegreeOnQuadrant(degrees['actual']['xAxis'], quadrants['actual']),
          'predecessor': this.getDegreeOnQuadrant(degrees['pred']['yAxis'], quadrants['pred'])
        };
      } else {
      result = {
        'actual': this.getDegreeOnQuadrant(degrees['actual']['yAxis'], quadrants['actual']),
        'predecessor': this.getDegreeOnQuadrant(degrees['pred']['xAxis'], quadrants['pred'])
      };
      }
      return result;
    }
    public toJSON(actualAmino: number[], predecessorAmino: number[]){
      const degrees = this.getDegrees(actualAmino, predecessorAmino);
      const quadrants =  this.quadrantObject(actualAmino, predecessorAmino);
      const calculateDegrees = this.getCorrectDegree(actualAmino, predecessorAmino, quadrants, degrees);
      const hours = [ this.toHour(calculateDegrees['predecessor']),
                    this.toHour(calculateDegrees['actual']) ];
      return hours 
    }
}
