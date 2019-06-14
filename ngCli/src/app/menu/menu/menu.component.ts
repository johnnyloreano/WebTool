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
    /**
   * @ignore
   */
  lastMenuV
  ngOnInit() {
    document.getElementById('menuLock').focus();
  }
  /**
   * @ignore
   */
  lastMenuVerify(e){
    if(e.keyCode == 9 && !e.shiftKey){
      e.preventDefault();
      document.getElementById('menuLock').focus();
      }
  }
}
