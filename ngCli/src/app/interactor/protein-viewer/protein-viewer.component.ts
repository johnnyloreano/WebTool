import { Component, OnInit, ViewChild, ComponentFactoryResolver} from '@angular/core';
import { DataService } from '../../core/data-service/data-service.service'
import { AdDirective } from '../host/a-host.directive'
import { Router } from '@angular/router';
import { AminoModal } from '../amino-modal/amino-modal.component'
import { DialogService } from 'ng2-bootstrap-modal';
import {TranscripterService} from '../../core/transcripter/transcripter.service'
import { AuditiveLabelComponent } from '../auditive-label/auditive-label.component';
@Component({
  selector: 'app-protein-viewer',
  template: `
            <h2>
              Visualizador de proteína
            </h2>
            <h3> 
              Proteína: {{proteinName}} 
            </h3>
            <div [ngStyle]="{'position':'relative','background-color': '#ADD8E6', 'min-height': '80vh', 'width': '95%', 'margin':'0 auto', 'border': '42px #ADD8E6 solid' }">
              <ng-template a-host ></ng-template>
            </div>
            `
})
export class ProteinViewerComponent implements OnInit {

  @ViewChild(AdDirective) host: AdDirective;
  constructor(private _componentFactoryResolver: ComponentFactoryResolver,
     private _dataService: DataService, private _route: Router, private _dialogService: DialogService, private _transcripter: TranscripterService) { }
  ngOnInit() {
    if (this._dataService.getProtein() === undefined) {
      this._route.navigate(['/']);
    }
    this.loadComponent();
  }
  loadComponent(){
    const protein = this._dataService.getProtein();
    const arrLabel = protein.residues;
    const pos = protein.alphaLoc;
    const helix_range = protein.helix_range;
    const sheet_range = protein.sheet_range;

    let actualHelix = 0;
    let actualSheet = 0;

    const hasHelix = helix_range.length > 0 ? true:false;
    const hasSheet = sheet_range.length > 0 ? true:false;

    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(AuditiveLabelComponent);
    const viewContainer = this.host.viewContainerRef;
    let arrComponent = Array<AuditiveLabelComponent>();
    viewContainer.clear();
    for(let i = 0; i < arrLabel.length;i++){
        let componentRef = viewContainer.createComponent(componentFactory);
        arrComponent.push(componentRef.instance);
        //Amino's plot
        arrComponent[i].setPosition(pos[i][1],pos[i][0]);
        (<AuditiveLabelComponent>componentRef.instance).initials = protein.residues[i].initials;
        arrComponent[i].openModal.subscribe(this.openModal)
        arrComponent[i].parent = this
        if(i > 0 ){
          // Sound placement
          let transitions = this._transcripter.getTransition(arrComponent[i].getPosArray(),arrComponent[i-1].getPosArray());
          arrComponent[i].downSound = transitions[0];
          arrComponent[i-1].upSound = transitions[1];
          // Helix verification
          if(hasHelix && actualHelix < helix_range.length){
            this.helixVerifier(arrComponent[i],arrLabel[i].number,helix_range[actualHelix]);
            if(arrComponent[i].isLastHelix) actualHelix++;            
          }
          //Sheet verification
          if(hasSheet && actualSheet < sheet_range.length){
            this.sheetVerifier(arrComponent[i],arrLabel[i].number,sheet_range[actualSheet])
            if(arrComponent[i].isLastSheet) actualSheet++;
          }
            //Last label verification
        if(i == arrLabel.length - 1){ 
          arrComponent[i].isLast = true;
          arrComponent[i].upSound = "Você saiu da proteína!"
        }  
      }
        else{ 
          arrComponent[i].isFirst = true;
          arrComponent[i].downSound = "Você saiu da proteína!"
        }
    }
  }
  helixVerifier(res:AuditiveLabelComponent,resNum:number, helixArray: Array<number>){
      if (resNum == helixArray[0]){
        return res.isFirstHelix = true
      }
      else if (resNum == helixArray[1]){
        return res.isLastHelix = true
      }
        else if (resNum > helixArray[0]){
          return res.isHelix = true
      }
  }
  sheetVerifier(res:AuditiveLabelComponent,resNum:number, sheetArray: Array<number>){
    if (resNum == sheetArray[0]){
      return res.isFirstSheet = true
    }
    else if (resNum == sheetArray[1]){
      return res.isLastSheet = true
    }
      else if (resNum > sheetArray[0]){
        return res.isSheet = true
    }
}
  openModal(args){
    args['parent']._dialogService.addDialog(AminoModal, {aminoInitials : args['initials']}).subscribe();
  }
}