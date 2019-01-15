import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-atom',
  template: '<span tabindex={{index}} [attr.aria-label]=ariaLabel class="d-inline-block text-center atom {{type}}">{{ name }}</span>',
  styleUrls: ['./atom.component.css']
})
export class AtomComponent implements OnInit {
  constructor() { }
  @Input() type: string;
  @Input() name: string;
  @Input() hLigands : number;
  private index = 0;
  //private binder="<span ng-bind-html="+this.hLigandsRender+"></span>";
  ariaLabel: string;
  ariaDictionary = {'H':"Hidrogênio",'C':"Carbono",'O':"Oxigênio",'S':"Enxofre",'N':"Nitrogênio"}
  ngOnInit(){
    this.name = this.type;
    this.ariaLabel =  this.ariaDictionary[this.type];
    if(this.name == 'H')
      this.index = -1
  }

}
