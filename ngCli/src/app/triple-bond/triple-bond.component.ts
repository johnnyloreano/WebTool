import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-triple-bond',
  template: '<span><hr><hr><hr></span>',
  styles: ['hr{border-color:black; width:50px;margin: 0.39rem 0 0.39rem 0 }span{display:inline-block;width:30px;height:20px;margin-right:30px}']
})
export class TripleBondComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
