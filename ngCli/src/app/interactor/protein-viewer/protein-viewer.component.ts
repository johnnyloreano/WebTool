import { Component, OnInit, ViewChild, ComponentFactoryResolver} from '@angular/core';
import { DataService } from '../../core/data-service/data-service.service'
import { AdDirective } from '../host/a-host.directive'
import { Router } from '@angular/router';
import { AminoModal } from '../amino-modal/amino-modal.component'
import { DialogService } from 'ng2-bootstrap-modal';
import {TranscripterService} from '../../core/transcripter/transcripter.service'
import { LabelResidueComponent } from '../../shared/label-residue/label-residue.component';
@Component({
  selector: 'app-protein-viewer',
  styleUrls : ["./protein.css"],
  template: `
            <h2>
              Visualizador de proteína
            </h2>
            <h3> 
              Proteína: {{proteinName}} 
            </h3>
            <div>
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

    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(LabelResidueComponent);
    const viewContainer = this.host.viewContainerRef;
    let arrComponent = Array<LabelResidueComponent>();
    viewContainer.clear();
    for(let i = 0; i < arrLabel.length;i++){
        let componentRef = viewContainer.createComponent(componentFactory);
        arrComponent.push(componentRef.instance);
        //Amino's plot
        arrComponent[i].position = [pos[i][0],pos[i][1]];
        (<LabelResidueComponent>componentRef.instance).initials = protein.residues[i].initials;
        arrComponent[i].openModal.subscribe(this.openModal)
        arrComponent[i]._parent = this
        if(i > 0 ){
          // Sound placement
          let transitions = this._transcripter.getTransition(arrComponent[i].position,arrComponent[i-1].position);
          arrComponent[i].downSound = transitions[1];
          arrComponent[i-1].upSound = transitions[0];
          console.log(arrComponent[i-1]._initials,"->",arrComponent[i]._initials);
          console.log([transitions[0], transitions[1] ]);
          // Helix verification
          if(hasHelix && actualHelix < helix_range.length){
            this.helixVerifier(arrComponent[i],arrLabel[i].number,helix_range[actualHelix]);
            if(arrComponent[i]._isLastHelix) actualHelix++;            
          }
          //Sheet verification
          if(hasSheet && actualSheet < sheet_range.length){
            this.sheetVerifier(arrComponent[i],arrLabel[i].number,sheet_range[actualSheet])
            if(arrComponent[i]._isLastSheet) actualSheet++;
          }
            //Last label verification
        if(i == arrLabel.length - 1){ 
          arrComponent[i]._isLast = true;
          arrComponent[i].upSound = "Você saiu da proteína!"
        }  
        //Test 
      }      
        else{ 
          arrComponent[i]._isFirst = true;
          arrComponent[i].downSound = "Você saiu da proteína!"
        }
    }
  }
  helixVerifier(res:LabelResidueComponent,resNum:number, helixArray: Array<number>){
      if (resNum == helixArray[0]){
        return res._isFirstHelix = true
      }
      else if (resNum == helixArray[1]){
        return res._isLastHelix = true
      }
        else if (resNum > helixArray[0]){
          return res._isHelix = true
      }
  }
  sheetVerifier(res:LabelResidueComponent,resNum:number, sheetArray: Array<number>){
    if (resNum == sheetArray[0]){
      return res._isFirstSheet = true
    }
    else if (resNum == sheetArray[1]){
      return res._isLastSheet = true
    }
      else if (resNum > sheetArray[0]){
        return res._isSheet = true
    }
}
  openModal(args){
    args['parent']._dialogService.addDialog(AminoModal, {aminoInitials : args['initials']}).subscribe();
  }
}