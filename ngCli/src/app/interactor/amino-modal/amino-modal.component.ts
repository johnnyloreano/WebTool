import { Component, ComponentFactoryResolver, OnInit, ViewChild } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { AdDirective } from '../host/a-host.directive';
import { HttpPdbRequesterService } from '../../core/http-pdb/http-pdb-requester.service'
import { LabelComponent } from '../../shared/label/label.component'
import { DataService } from '../../core/data-service/data-service.service'
import 'focus-trap/dist/focus-trap';
import { Aminoacid } from '../../shared/aminoacid';
import { CombineLatestSubscriber } from 'rxjs/internal/observable/combineLatest';
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
                   <div class="modal-footer">
                   <button type="button" class="btn btn-secondary close" (click)="closeModal()" >Voltar</button>
                   </div>
               </div>
            </div>`
})
export class AminoModal extends DialogComponent<AminoModel, boolean> implements AminoModel,OnInit {

  @ViewChild(AdDirective) host: AdDirective;
  aminoInitials : string
  constructor(private _componentFactoryResolver: ComponentFactoryResolver,private _dialogService :DialogService,private _HttpRequester : HttpPdbRequesterService, private _dataService : DataService) {
    super(_dialogService);
  }
  createFocusTrap = require("focus-trap/dist/focus-trap");
  focusTrap;
  ngOnInit(){
    let componentFactory = this._componentFactoryResolver.resolveComponentFactory(LabelComponent);
    let viewContainer = this.host.viewContainerRef;
    viewContainer.clear()
    viewContainer.createComponent(componentFactory)
    console.log( this.instantiateAmino( this.aminoInitials) );

    this.setFocus();

  }
  async instantiateAmino(aminoName){
    var content = await this._HttpRequester.requestAmino(aminoName);
    console.log(content)
    var amino = new Aminoacid();
    amino.name = content['name']
    for(let i = 0; content.hasOwnProperty("atom"+i); i++){
      let atom = new Atom();
      atom.x = content["atom"+i]['x'];
      atom.y = content["atom"+i]['y'];
      atom.initials = content["atom"]['symbol'];
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