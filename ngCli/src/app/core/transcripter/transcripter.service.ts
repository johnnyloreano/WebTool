import { Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TranscripterService {

  /**
   * It returns the degrees of the triangle.
   * It needs the position of two points, pos1 and pos2, and returns the degree of the triangle made by the two points
   *
   * @param {Array<number>} actualAmino The position of the first amino.
   * @param {Array<number>} predecessorAmino The position of the second amino.
   * @returns {Object} The degrees.
   * @memberof TranscripterService
   */
  getDegrees(actualAmino: Array<number>, predecessorAmino: Array<number>): Object {
  const deltaX = this.getDelta(actualAmino[0] , predecessorAmino[0]);
  const deltaY = this.getDelta(actualAmino[1] , predecessorAmino[1]);
  let degree = Math.abs(deltaY) / Math.abs(deltaX);
  degree = Math.atan(degree) * 180 / Math.PI;
  degree = Math.abs(degree);
  const degrees = {
    'xAxis': Math.round(degree),
    'yAxis': Math.round(90 - degree)
  };
  const aminoDegrees = {
    'actual' : {'xAxis' : degrees['yAxis'], 'yAxis' : degrees['xAxis']},
    'pred' : degrees
  };
  return aminoDegrees;
  }
  getDistance(pos1: Array<number>, pos2: Array<number>) {
    const deltaX = this.getDelta(pos1[0] , pos2[0]);
    const deltaY = this.getDelta(pos1[1] , pos2[1]);
    let result = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
    result = Math.trunc(result); 
    return this.round(result);
  }
  getQuadrant(pos: number[], posRelative: number[]): number { // Pega o quadrante do PRIMEIRO parâmetro em  relação ao SEGUNDO
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
      default:
        return 0;
    }
  }
  quadrantObject(actual: number[], pred: number[]): Object {
    return {
      'pred': this.getQuadrant(actual, pred),
      'actual': this.getQuadrant(pred, actual)
    };
  }
  toHour(degree: number): number {
    const aux = (degree / 30);
    let hour = Math.trunc(aux);
    let min = Math.trunc( (aux - hour) * 60) ;
    min = (this.round( min ));
    if (min === 60) hour++;
    return hour;
  }
  round(val: number): number {
    return Math.round(val / 10 ) * 10;
  }

  getDelta(val: number, val2: number): number {
    return val2 - val;
  }

  getDegreeOnQuadrant(degree: number, quadrant: number) {
      let auxMult: number;
      switch (quadrant) {
        case (1) : auxMult = 0 ; break;
        case (2) : auxMult = 3; break;
        case (3) : auxMult = 2; break;
        case (4) : auxMult = 1; break;
      }
    return degree + (auxMult * 90);
  }
  getCorrectDegree(actual: number[], predecessor: number[], quadrants: Object, degrees: Object) {
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

  createText(hour: number): string {
    let text: string;
    if (hour >= 11 || hour <= 2 ) {
    text = 'Subindo ';
    } else if (hour > 2 && hour <= 5) {
    text = 'Indo para a direita ';
       } else if (hour > 5 && hour <= 7) {
    text = 'Descendo ';
       } else if (hour > 7 && hour < 11) {
    text = 'Indo para a esquerda ';
       }
      return text += hour + ' horas.';
  }
  
  /**
   *  Generate the sounds of each transitions.
   * It takes two sets of coordinates of differents aminoacids and transcript the sound of each transition, to top, and to bottom
   *
   * @param {number[]} actualAmino
   * @param {number[]} predecessorAmino
   * @returns the transcription of the transitions
   * @memberof TranscripterService
   */
  getTransition(actualAmino: number[], predecessorAmino: number[]): string[] {
    const degrees = this.getDegrees(actualAmino, predecessorAmino);
    const quadrants =  this.quadrantObject(actualAmino, predecessorAmino);
    const calculateDegrees = this.getCorrectDegree(actualAmino, predecessorAmino, quadrants, degrees);
    const hours = [ this.toHour(calculateDegrees['predecessor']),
                  this.toHour(calculateDegrees['actual']) ];
    console.log(hours);
    return [this.createText(hours[1]), this.createText(hours[0])];
  }
}
