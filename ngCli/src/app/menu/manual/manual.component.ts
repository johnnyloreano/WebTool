import { Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-manual',
  templateUrl: './manual.component.html',
  styleUrls: ['./manual.component.css']
})
export class ManualComponent implements OnInit{

  constructor(private _router : Router) { }
  ngOnInit(){
    document.getElementById('principalTitle').focus();
  }
  goTo(el: string){
    document.getElementById(el).focus();
  }
  lastHeaderVerify(e){
    if(e.keyCode == 9 && !e.shiftKey){
      e.preventDefault();
      document.getElementById('buttonBack').focus();
      }
    else if(e.keyCode == 13)
      this.goTo('nav-sp');
  }
  backButtonVerify(e){
    if(e.keyCode == 9){
      e.preventDefault();
      document.getElementById('intro-h').focus();
      }
  }
}
