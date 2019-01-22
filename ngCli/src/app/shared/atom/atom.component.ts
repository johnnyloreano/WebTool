import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-atom',
  template: '<div tabindex="0" [attr.aria-label]=ariaLabel class="d-inline-block text-center atom {{type}}">{{ name }}</div>',
  styleUrls: ['./atom.component.css']
})
export class AtomComponent implements OnInit {
  constructor() { }
  @Input() type: string;
  ariaLabel: string;
  ariaDictionary = {'H':"Hidrogênio",'C':"Carbono",'O':"Oxigênio",'S':"Enxofre",'N':"Nitrogênio"}
  ngOnInit(){
    this.ariaLabel =  this.ariaDictionary[this.type];
  }

}
