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
  goTo(el: string){
    document.getElementById(el).focus();
  }
}
