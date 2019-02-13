import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bond',
  templateUrl: './bond.component.html',
  styleUrls: ['./bond.component.css']
})
export class BondComponent implements OnInit {
  _x : number;
  _y : number;
  _size: number;
  _degree: number;

  ngOnInit(){}
  style(){
    return {'bottom': this._y+"%", 'left': this._x+"%",'width': this._size+'%', 'transform' : 'rotate('+this._degree+'deg)'};
  }
}
