import { Component, OnInit,Input} from '@angular/core';

@Component({
  selector: 'app-bond',
  template: '<span><hr [ngStyle]=styleRotate></span>',
  styles: ['hr{border-color:black; width:50px;}span{display:inline-block;width:30px;height:22px;margin-right:25px}']
})
export class BondComponent implements OnInit {
  @Input('degree') degree:number;
  styleRotate : string;
  constructor() { }
  ngOnInit() {
    if(this.degree == undefined)
      this.degree = 0;
    //this. n = "{transform:rotate("+this.degree+"deg)}";
  }
}
