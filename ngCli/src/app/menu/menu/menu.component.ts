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
  }

  goForm() {
    this._route.navigate(['/buscador']);
  }
  goManual() {
    this._route.navigate(['/manual']);
  }
  lastMenuVerify(e){
    e.preventDefault();
    console.log(e.keyCode);
    switch(e.keyCode){
      case 13:
        return this.goManual();
      case 9 :
        document.getElementById('menuLock').focus();
    }
  }
}
