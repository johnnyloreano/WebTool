import { Component, OnInit, ViewChild, ComponentFactoryResolver, ElementRef, Renderer2} from '@angular/core';
import { DataService } from '../../core/data-service/data-service.service'
import { AdDirective } from '../host/a-host.directive'
import { Router } from '@angular/router';
import { AminoModal } from '../amino-modal/amino-modal.component'
import { DialogService } from 'ng2-bootstrap-modal';
import {TranscripterService} from '../../core/transcripter/transcripter.service'
import { LabelResidueComponent } from '../../shared/label-residue/label-residue.component';
import { TalkerService} from '../../core/talker/talker.service';
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
            <div id="viewerHold" (keydown)="$event.keyCode == 13 ? this._talker.speak('Entrando na proteína') : null">
            <svg #svg></svg>
            <ng-template a-host ></ng-template>
            </div>
            `
})
export class ProteinViewerComponent implements OnInit {

  @ViewChild(AdDirective) host: AdDirective;
  @ViewChild("svg") svgHost: ElementRef;
  constructor(private _componentFactoryResolver: ComponentFactoryResolver,
     private _dataService: DataService, private _route: Router, 
     private _dialogService: DialogService, private _transcripter: TranscripterService,
     private _renderer : Renderer2, private _talker : TalkerService) { }
  ngOnInit() {
    if (this._dataService.getProtein() === undefined) {
      this._route.navigate(['/menu']);
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
        const totalWidth = (document.getElementById('viewerHold').clientWidth);
        const totalHeight = (document.getElementById('viewerHold').clientHeight);
        const plotPositions = [totalWidth * pos[i][0] / 100,
                              totalHeight * pos[i][1] / 100];
                              //  console.log(plotPositions)
        arrComponent[i].position = plotPositions;
        (<LabelResidueComponent>componentRef.instance).initials = protein.residues[i].initials;
        // arrComponent[i].openModal.subscribe(this.openModal)
        // arrComponent[i]._parent = this
        if(i > 0 ){
          // Sound placement
          let transitions = this._transcripter.getTransition(arrComponent[i].position,arrComponent[i-1].position);
          arrComponent[i].downSound = transitions[1];
          arrComponent[i-1].upSound = transitions[0];
          // console.log(arrComponent[i-1]._initials,"->",arrComponent[i]._initials);
          // console.log([transitions[0], transitions[1] ]);
          // Helix verification
          if(hasHelix && actualHelix < helix_range.length){
            this.helixVerifier(arrComponent[i],arrLabel[i].number,helix_range[actualHelix]);
            if (arrComponent[i]._isHelix)
            this.plotLine(arrComponent[i - 1].position,arrComponent[i].position,arrComponent[i]._isHelix);

            if(arrComponent[i]._isLastHelix) actualHelix++;            
          }
          //Sheet verification
          if(hasSheet && actualSheet < sheet_range.length){
            this.sheetVerifier(arrComponent[i],arrLabel[i].number,sheet_range[actualSheet])
            if(arrComponent[i]._isLastSheet) actualSheet++;
          }
          if(!arrComponent[i]._isHelix && !arrComponent[i]._isSheet)
            this.plotLine(arrComponent[i - 1].position,arrComponent[i].position,arrComponent[i]._isHelix);
            //Last label verification
        if(i == arrLabel.length - 1){ 
          arrComponent[i]._isLast = true;
          arrComponent[i].upSound = "Você saiu da proteína!"
        }  
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
  plotLine(position:Array<number>, position2:Array<number>,is_helix : boolean){
    const totalWidth = (document.getElementById('viewerHold').clientWidth) ;
    const totalHeight = (document.getElementById('viewerHold').clientHeight) ;
    const plotPositionsStart = [  position[0] ,
                                 - position[1] + totalHeight ];
    const plotPositionsEnd = [  position2[0] ,
                                - position2[1] + totalHeight];
    let line = document.createElementNS('http://www.w3.org/2000/svg','line');
    this._renderer.setAttribute(line,"x1",plotPositionsStart[0] + 20+"px");
    this._renderer.setAttribute(line,"y1",plotPositionsStart[1]- 20 +"px");
    this._renderer.setAttribute(line,"x2",plotPositionsEnd[0]+ 20+"px");
    this._renderer.setAttribute(line,"y2",plotPositionsEnd[1]- 20 +"px");
    this._renderer.setStyle(line,"stroke-width","1.05");
    if(is_helix){
      this._renderer.setStyle(line,"stroke","red");
    }
    else
      this._renderer.setStyle(line,"stroke","black");
    this._renderer.appendChild(this.svgHost.nativeElement, line);
  }
  // plotSineLine(position:Array<number>, position2:Array<number>){
  //   const totalWidth = (document.getElementById('viewerHold').clientWidth) ;
  //   const totalHeight = (document.getElementById('viewerHold').clientHeight) ;
  //   const plotPositionsStart = [  position[0] + 20 , totalHeight - position[1] - 20];
  //   const plotPositionsEnd = [ position2[0] + 20 , totalHeight - position2[1] - 20];
  //   const middlePoint = [ (plotPositionsStart[0] + plotPositionsEnd[0] ) / 2 ,
  //                          (plotPositionsStart[1] + plotPositionsEnd[1] )/ 2];
  //   const startWave = "M"+plotPositionsStart[0] + " "+plotPositionsStart[1];
  //   let firstWave = " Q"
  //                       + (middlePoint[0]/4 )*3.8 +" "+
  //                         (middlePoint[1] /4 )*3.8 +" ";
  //   firstWave += middlePoint[0]+" "+middlePoint[0];
  //   const middlePoint2 = [middlePoint[0]+ plotPositionsEnd[0] / 2, middlePoint[1] + plotPositionsEnd [1] / 2];
  //   const secondWave = " Q"+
  //                       middlePoint2[0] / 4+" "+middlePoint2[1] / 4
  //                       " ";
  //   const EndWave = plotPositionsEnd[0] +" "+(plotPositionsEnd[1]);
  //   const plotString = startWave + firstWave+secondWave+EndWave;
  //   console.log(plotString);
  //   let sine = document.createElementNS('http://www.w3.org/2000/svg','path');
  //   this._renderer.setAttribute(sine,"d",plotString);
  //   this._renderer.setStyle(sine,"stroke-width","1.5");
  //   this._renderer.setStyle(sine,"stroke","red")
  //   this._renderer.setStyle(sine,"fill","transparent")
  //   this._renderer.appendChild(this.svgHost.nativeElement, sine);
  // }
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