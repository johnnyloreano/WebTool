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
    degree = Math.atan(degree) * 180 / Math.PI;
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
    private getQuadrant(pos: number[], posRelative: number[]): number {
      const posX = this.getDelta(pos[0], posRelative[0]);
      const posY = this.getDelta(pos[1], posRelative[1]);
      switch (true) {
        case (posX > 0 && posY > 0):
          return 1;
        case (posX < 0 && posY > 0):
          return 2;
        case (posX < 0 && posY < 0):
          return 3;
        case (posX > 0 && posY < 0):
          return 4;

        case (posX == 0 && posY > 0):
          return 1;
        case (posX < 0 && posY == 0):
          return 3;
        case (posX == 0 && posY < 0):
          return 4;
        case (posX > 0 && posY == 0):
          return 4;
      }
    }
    public _getQuadrant(pos : number[]){
      switch (true) {
        case (pos[0] > 50 && pos[1] > 50):
          return 1;
        case (pos[0] < 50 && pos[1] > 0):
          return 2;
        case (pos[0] < 50 && pos[1] < 50):
          return 3;
        case (pos[0] > 50 && pos[1] < 50):
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
          case (0) : auxMult = 0; break;
        }
      return degree + (auxMult * 90);
    }
    private getCorrectDegree(actual: number[], predecessor: number[], quadrants: Object, degrees: Object) {
      let result ;
      if (actual[0] > predecessor[0]) {
        if(actual[1] < predecessor [1])
        result = {
          'actual': this.getDegreeOnQuadrant(degrees['actual']['xAxis'], quadrants['actual']),
          'predecessor': this.getDegreeOnQuadrant(degrees['pred']['yAxis'], quadrants['pred'])
        };
        else{
          result = {
            'actual': this.getDegreeOnQuadrant(degrees['actual']['yAxis'], quadrants['actual']),
            'predecessor': this.getDegreeOnQuadrant(degrees['pred']['xAxis'], quadrants['pred'])
          } 
        }
      } else {
        if(actual[1] < predecessor [1])
        result = {
          'actual': this.getDegreeOnQuadrant(degrees['actual']['yAxis'], quadrants['actual']),
          'predecessor': this.getDegreeOnQuadrant(degrees['pred']['xAxis'], quadrants['pred'])
        };
        else
        result = {
          'actual': this.getDegreeOnQuadrant(degrees['actual']['xAxis'], quadrants['actual']),
          'predecessor': this.getDegreeOnQuadrant(degrees['pred']['yAxis'], quadrants['pred'])
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
