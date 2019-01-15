import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-double-bond',
  template: '<span><hr><hr></span>',
  styles: ['hr{border-color:black; width:50px;}span{display:inline-block;width:30px;height:28px;margin-right:25px}']
})
export class DoubleBondComponent implements OnInit {
  constructor() { }

  ngOnInit() {
  }

}