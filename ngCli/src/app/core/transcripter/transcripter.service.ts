import { Injectable} from '@angular/core';
import { MathService } from '../math/math.service';
@Injectable({
  providedIn: 'root'
})
export class TranscripterService {

  constructor(private _mathS : MathService){}

  private createText(hour: number, minutes: number, distance: number): string {
    let text: string;
    text = 
    text = this.specialText(hour, minutes);
    if (text == null) {
      text = this.commonText(hour);
      text += this.hourMinText(hour, minutes);
    }
    return text + '.Distância de ' + distance + ' centímetros';
  }
  private specialText(hour: number, minutes: number) {
    if (minutes === 0) {
      if (hour === 0 || hour === 12) {return 'Subindo';
      } else if (hour === 3) {return 'Indo para a direita';
      } else if (hour === 9) {return 'Indo para a esquerda';
      } else if (hour === 6) {return 'Descendo'; }
    }
    return null;
  }
  private commonText(hour: number) {
    if (hour >= 11 || hour <= 2 ) {
    return 'Subindo ';
    } else if (hour > 2 && hour <= 5) {
    return 'Indo para a direita ';
       } else if (hour > 5 && hour <= 7) {
    return 'Descendo ';
       } else if (hour > 7 && hour < 11) {
    return 'Indo para a esquerda ';
       }
  }

  private hourMinText(hours: number, minutes: number): string {
    let text = '';
    if (hours !==  0 && minutes !== 0) {text = ' e '; }
    if (hours > 0) {
    text = hours + ' horas' + text;
    }
    if (minutes > 0) {
    text += minutes + ' minutos';
    }
    return text;
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
  public getTransition(actualAmino: number[], predecessorAmino: number[]): string[] {
    const info = this._mathS.toJSON(actualAmino,predecessorAmino);
    const text = [this.createText(info['hour'][1][0],info['hour'][1][1],info['distance']),
                  this.createText(info['hour'][0][0],info['hour'][0][1],info['distance'])];
    // console.log(calculateDegrees);
    return text;
  }
}
