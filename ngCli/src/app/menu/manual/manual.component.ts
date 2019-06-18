import { Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-manual',
  templateUrl: './manual.component.html',
  styleUrls: ['./manual.component.css']
})
export class ManualComponent implements OnInit{

  ngOnInit(){
    document.getElementById('principalTitle').focus();
  }
  /**
   * 
   * @ignore
   */
  goTo(event:KeyboardEvent,el: string){
    event.preventDefault();
    document.getElementById(el).focus();
    document.getElementById(el).focus();
  }

}
