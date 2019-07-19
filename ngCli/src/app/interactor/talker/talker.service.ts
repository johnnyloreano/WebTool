
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TalkerService {
  static talker = new SpeechSynthesisUtterance();
  static sayTimeout = setTimeout(function () { TalkerService.speak(""); }, 250);

  static speak(message:string) : void{
    if (speechSynthesis.speaking) {
      // SpeechSyn is currently speaking, cancel the current utterance(s)
      speechSynthesis.cancel();
      // Make sure we don't create more than one timeout...
      if (TalkerService.sayTimeout !== null)
          clearTimeout(TalkerService.sayTimeout);
        }
      // Good to go
      const msg = new SpeechSynthesisUtterance(message);
      msg.volume = 1.0;
      msg.pitch = 1.0;
      msg.rate = 0.9;
      msg.voice = TalkerService.toPortuguese();
      msg.lang = "pt-BR";
      speechSynthesis.speak(msg);
      console.log(message)
  }
  static toPortuguese(){
    let i :number;
    for(i = 0;speechSynthesis.getVoices()[i].lang.toLowerCase() != "pt-br"; i++)
    return speechSynthesis.getVoices()[i];
  }
}