import { Injectable} from '@angular/core';
import { MathService } from '../math/math.service';
@Injectable({
  providedIn: 'root'
})
export class TranscripterService {

  constructor(private _mathS : MathService){}

  private createText(hour: number): string {
    let text: string;
      text = this.commonText(hour);
      text += this.hourMinText(hour);
    return text;
  }

  private commonText(hour: number) {
    if (hour >= 11 || hour <= 2 ) {
    return 'Subindo ';
    } else if (hour > 2 && hour < 5) {
    return 'Indo para a direita ';
       } else if (hour >= 5 && hour <= 7) {
    return 'Descendo ';
       } else if (hour > 7 && hour < 11) {
    return 'Indo para a esquerda ';
       }
  }

  private hourMinText(hours: number): string {
    return hours + ' horas';
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
    const text = [this.createText(info[1]),
                  this.createText(info[0])];
    return text;
  }
}
