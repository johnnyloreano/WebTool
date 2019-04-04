import { Component, OnInit, ViewChild, ComponentFactoryResolver, ElementRef, Renderer2} from '@angular/core';
import { DataService } from '../../core/data-service/data-service.service'
import { AdDirective } from '../host/a-host.directive'
import { Router } from '@angular/router';
import {TranscripterService} from '../../core/transcripter/transcripter.service'
import { LabelResidueComponent } from '../../shared/label-residue/label-residue.component';
import { TalkerService} from '../../core/talker/talker.service';
@Component({
  selector: 'app-protein-viewer',
  styleUrls : ["./protein.css"],
  template: `
            <h2 tabindex='0'>
              Visualizador de proteína
            </h2>
            <h3 tabindex='0'> 
              Proteína: {{proteinName}} 
            </h3>
            <nav>
              <ul id="menuList">
                <li>  
                  <a tabindex="0" class="btn bg-primary text-white" (click)="focusViewer()" (keydown)="$event.keyCode == 13 ?  focusViewer() : null">Entrar na proteína</a>
                </li>
                <li>
                  <a tabindex="0" class="btn bg-primary text-white" routerLink="/menu" (keydown)="lastBtnVerify($event)">Voltar ao menu anterior</a>
                </li>
              </ul>            
              </nav>
            <div tabindex='-1' id="viewerHold" aria-hidden="true" aria-label="Visualizador de proteína. Use o tab para começar!" (keydown)="$event.keyCode == 13 ? this._talker.speak('Entrando na proteína') : null">
            <svg #svg></svg>
            <ng-template a-host ></ng-template>
            </div>
            `
})
export class ProteinViewerComponent implements OnInit {
  private proteinName : string;
  private protein = this._dataService.getProtein();
  @ViewChild(AdDirective) host: AdDirective;
  @ViewChild("svg") svgHost: ElementRef;
  constructor(private _componentFactoryResolver: ComponentFactoryResolver,
     private _dataService: DataService, private _route: Router, private _transcripter: TranscripterService,
     private _renderer : Renderer2, private _talker : TalkerService) { }
  ngOnInit() {
    if(this.protein === undefined )
      this._route.navigate(['/menu']);
    this.loadComponent();
  }
  loadComponent(){
    this.proteinName = this.protein.identifier;
    const arrLabel = this.protein.residues;
    const pos = this.protein.alphaLoc;
    const helix_range = this.protein.helix_range;
    const sheet_range = this.protein.sheet_range;

    let actualHelix = 0;
    let actualSheet = 0;

    const hasHelix = helix_range.length > 0;
    const hasSheet = sheet_range.length > 0;

    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(LabelResidueComponent);
    const viewContainer = this.host.viewContainerRef;
    let arrComponent = Array<LabelResidueComponent>();
    for(let i = 0; i < arrLabel.length;i++){
      let componentRef = viewContainer.createComponent(componentFactory);
      arrComponent.push(componentRef.instance);
      //Amino's plot
      const totalWidth = (document.getElementById('viewerHold').clientWidth);
      const totalHeight = (document.getElementById('viewerHold').clientHeight);
      const plotPositions = [totalWidth * pos[i][0] / 100,
                            totalHeight * pos[i][1] / 100];
      arrComponent[i].position = plotPositions;
      arrComponent[i]._initials = arrLabel[i].initials;
      if(i > 0 ){
          // Sound placement
          let transitions = this._transcripter.getTransition(arrComponent[i].position,arrComponent[i-1].position);
          arrComponent[i].downSound = transitions[1];
          arrComponent[i-1].upSound = transitions[0];
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

  focusViewer(){
    document.getElementById('viewerHold').tabIndex = 0;    
    document.getElementById('viewerHold').focus();    
  }
}