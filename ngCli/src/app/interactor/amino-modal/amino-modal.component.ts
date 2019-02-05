import { Component, ComponentFactoryResolver, OnInit, ViewChild } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { AdDirective } from '../host/a-host.directive';
import { HttpService } from '../../core/http-pdb/http-pdb-requester.service'
import { LabelComponent } from '../../shared/label/label.component'
import { DataService } from '../../core/data-service/data-service.service'
import 'focus-trap/dist/focus-trap';
import { Aminoacid } from '../../shared/aminoacid';
import { Atom } from '../../shared/atom';

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
                 <div class="modal-body">
                   <ng-template a-host></ng-template>
                  </div>
               </div>
            </div>`
})
export class AminoModal extends DialogComponent<AminoModel, boolean> implements AminoModel,OnInit {

  @ViewChild(AdDirective) host: AdDirective;
  aminoInitials : string
  constructor(private _componentFactoryResolver: ComponentFactoryResolver,private _dialogService :DialogService,private _HttpRequester : HttpService, private _dataService : DataService) {
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
      if(arrAtoms[x].initials != "Hz"){
        let compRef = viewContainer.createComponent(componentFactory);
        compRef.instance._x = arrAtoms[x].x;
        compRef.instance._y = arrAtoms[x].y;
        compRef.instance._z = arrAtoms[x].z;
        compRef.instance.initials = arrAtoms[x].initials.toUpperCase();
        }
      }
    });
    this.setFocus();
  }
  async instantiateAmino(aminoName){
    var content = await this._HttpRequester.requestAmino(aminoName);
    var amino = new Aminoacid();
    amino.name = content['name'];
    amino.atoms = new Array<Atom>();
    console.log(content)
    for(let i = 1; content.hasOwnProperty(""+i); i++){
      let atom = new Atom();
      atom.x = content[""+i]['x'];
      atom.y = content[""+i]['y'];
      atom.z = content[""+i]['z'];
      atom.initials = content[""+i]['symbol'];
      amino.atoms.push(atom);
    }
    return amino;
  }
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