import { Component, ComponentFactoryResolver, OnInit, ViewChild,Renderer2, ElementRef } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { AdDirective } from '../host/a-host.directive';
import { HttpService } from '../../core/http-pdb/http-pdb-requester.service'
import { LabelComponent } from '../../shared/label/label.component'
import { DataService } from '../../core/data-service/data-service.service'
import 'focus-trap/dist/focus-trap';
import { Aminoacid } from '../../shared/aminoacid';
import { Atom } from '../../shared/atom';
import { BondComponent } from '../../shared/bond/bond.component'
import { MathService } from '../../core/math/math.service'
import { ConsoleReporter } from 'jasmine';

export interface AminoModel {
}
@Component({  
  selector: 'confirm',
  styleUrls: ['./amino-modal.component.css'],
  template: `<div class="modal-dialog">
              <div class="modal-content">
                 <div class="modal-header">
                   <button type="button" class="close" (click)="closeModal()">&times;</button>
                   <h4 class="modal-title">Close</h4>
                 </div>
                 <div class="modal-body" id="canvas">
                 <svg #svg>
                  
                  Sorry, your browser does not support inline SVG.
                </svg>
                 <ng-template a-host></ng-template>
                   </div>
               </div>
            </div>`
})
export class AminoModal extends DialogComponent<AminoModel, boolean> implements AminoModel,OnInit {

  @ViewChild(AdDirective) host: AdDirective;
  @ViewChild('svg') svgHost: ElementRef;
  aminoInitials : string
  constructor(private _renderer : Renderer2,private _math: MathService,private _componentFactoryResolver: ComponentFactoryResolver,private _dialogService :DialogService,private _HttpRequester : HttpService, private _dataService : DataService) {
    super(_dialogService);
  }
  createFocusTrap = require("focus-trap/dist/focus-trap");
  focusTrap;
  ngOnInit(){
    this.insertComponent();
  }
  insertComponent(){
    let componentFactory = this._componentFactoryResolver.resolveComponentFactory(LabelComponent);
    let viewContainer = this.host.viewContainerRef;
    viewContainer.clear()
    this.instantiateAmino(this.aminoInitials).then((data) => {
      const arrAtoms = data.atoms;
      for(let x = 0; x < arrAtoms.length;x++){      
        let compRef = viewContainer.createComponent(componentFactory);
        let instance = compRef.instance;
        instance._y = arrAtoms[x].y;
        instance._x = arrAtoms[x].x;
        instance._z = arrAtoms[x].z;
        instance.initials = arrAtoms[x].initials.toUpperCase();
      }
    });

    this.setFocus();
  }
  async instantiateAmino(aminoName){
    var content = await this._HttpRequester.requestAmino(aminoName);
    var amino = new Aminoacid();
    amino.name = content['name'];
    amino.atoms = new Array<Atom>();
    for(let i = 0; content.hasOwnProperty(""+i); i++){
      let atom = new Atom();
      atom.x = content[""+i]['x'];
      atom.y = content[""+i]['y'];
      atom.z = content[""+i]['z'];
      atom.initials = content[""+i]['symbol'];
      amino.atoms.push(atom);
    }
    for(let i = 0;content.hasOwnProperty(""+i); i++){
      if(content[i]['bond'].length > 0){
        let arrayBond = content[i]['bond'];
        for(let x = 0; x < arrayBond.length;x++){
          let toIndex = arrayBond[x]['to']
          let positions = [amino.atoms[i].x,amino.atoms[i].y];
          let positions2 = [amino.atoms[toIndex].x, amino.atoms[toIndex].y];
            console.log(positions)
            console.log(positions2)
          // this.instantiateLine(positions,positions2);
        }
      }
    }
    return amino;
  }
  // instantiateLine(position:number[],position2:number[]) : void{
  //   let line = document.createElementNS('http://www.w3.org/2000/svg','line');
  //   this._renderer.setAttribute(line,"x1",position[0]+"%");
  //   this._renderer.setAttribute(line,"y1",position[1]+"%");
  //   this._renderer.setAttribute(line,"x2",position2[0]+"%");
  //   this._renderer.setAttribute(line,"y2",position2[1]+"%");
  //   this._renderer.setStyle(line,"stroke-width","1");
  //   this._renderer.setStyle(line,"stroke","rgb(255,0,0)")
  //   this._renderer.appendChild(this.svgHost.nativeElement, line);
  // }
  setFocus(){
    this.focusTrap = this.createFocusTrap(".modal-content", {
      initialFocus: ".close",
      escapeDeactivates: false
    });
    this.focusTrap.activate();
  }
  closeModal(){
    this.focusTrap.deactivate()
    this.close()
  }
  
}