import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TalkerService {
  static speak(message:string) : void{
    const msg = new SpeechSynthesisUtterance();
    msg.volume = 0.2; // 0 to 1
    msg.rate = .8; // 0.1 to 10
    msg.pitch = 1; // 0 to 2
    msg.text  = message;
    const vvalue = 44;
    msg.lang = speechSynthesis.getVoices()[vvalue].lang;
    console.log(msg.text)
  return speechSynthesis.speak(msg);
  }
}