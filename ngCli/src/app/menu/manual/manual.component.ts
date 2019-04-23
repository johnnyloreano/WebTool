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
}
