import { Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  private pdbContent: any;
  constructor( private _route: Router) {}
  ngOnInit() {
    document.getElementById('menuLock').focus();
  }

  goForm() {
    this._route.navigate(['/buscador']);
  }
  goManual() {
    this._route.navigate(['/manual']);
  }
  lastMenuVerify(e : KeyboardEvent){
    if((e.keyCode == 9 && !e.shiftKey) || (e.keyCode == 40)){
      e.preventDefault();
      document.getElementById('menuLock').focus();
      }
    else if(e.keyCode == 13)
      this.goManual();
  }
}
