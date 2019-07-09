import { Component, OnInit} from '@angular/core';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
    /**
   * @ignore
   */
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
