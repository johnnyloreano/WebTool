import { Component, OnInit, ViewChild, ComponentFactoryResolver, ElementRef, Renderer2} from '@angular/core';
import { DataService } from '../../core/data-service/data-service.service'
import { AdDirective } from '../host/a-host.directive'
import { Router } from '@angular/router';
import { DialogService } from 'ng2-bootstrap-modal';
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
            <div tabindex='-1' id="viewerHold" aria-label="Visualizador de proteína. Use o tab para começar!" (keydown)="$event.keyCode == 13 ? this._talker.speak('Entrando na proteína') : null">
            <svg #svg></svg>
            <ng-template a-host ></ng-template>
            </div>
            `
})
export class ProteinViewerComponent implements OnInit {
  private proteinName : string;
  @ViewChild(AdDirective) host: AdDirective;
  @ViewChild("svg") svgHost: ElementRef;
  constructor(private _componentFactoryResolver: ComponentFactoryResolver,
     private _dataService: DataService, private _route: Router, 
     private _dialogService: DialogService, private _transcripter: TranscripterService,
     private _renderer : Renderer2, private _talker : TalkerService) { }
  ngOnInit() {
    this._dataService.parseAminoData();
    // this.loadComponent();
  }
  // loadComponent(){
  //   const protein = this._dataService.getProtein();
  //   this.proteinName = protein.identifier;
  //   const arrLabel = protein.residues;
  //   const pos = protein.alphaLoc;
  //   const helix_range = protein.helix_range;
  //   const sheet_range = protein.sheet_range;

  //   let actualHelix = 0;
  //   let actualSheet = 0;

  //   const hasHelix = helix_range.length > 0;
  //   const hasSheet = sheet_range.length > 0;
  //   let arrComponent = Array<LabelResidueComponent>();
  //   for(let i = 0; i < arrLabel.length;i++){
  //     let component ;
  //       //Amino's plot

  //                             //  console.log(plotPositions)
  //       // arrComponent[i].openModal.subscribe(this.openModal)
  //       // arrComponent[i]._parent = this
  //       if(i > 0 ){
  //         // Sound placement
  //         let transitions = this._transcripter.getTransition(arrComponent[i].position,arrComponent[i-1].position);
  //         arrComponent[i].downSound = transitions[1];
  //         arrComponent[i-1].upSound = transitions[0];
  //         // console.log(arrComponent[i-1]._initials,"->",arrComponent[i]._initials);
  //         // console.log([transitions[0], transitions[1] ]);
  //         // Helix verification
  //         if(hasHelix && actualHelix < helix_range.length){
  //           this.helixVerifier(arrComponent[i],arrLabel[i].number,helix_range[actualHelix]);
  //           if (arrComponent[i]._isHelix)
  //           this.plotLine(arrComponent[i - 1].position,arrComponent[i].position,arrComponent[i]._isHelix);

  //           if(arrComponent[i]._isLastHelix) actualHelix++;            
  //         }
  //         //Sheet verification
  //         if(hasSheet && actualSheet < sheet_range.length){
  //           this.sheetVerifier(arrComponent[i],arrLabel[i].number,sheet_range[actualSheet])
  //           if(arrComponent[i]._isLastSheet) actualSheet++;
  //         }
  //         if(!arrComponent[i]._isHelix && !arrComponent[i]._isSheet)
  //           this.plotLine(arrComponent[i - 1].position,arrComponent[i].position,arrComponent[i]._isHelix);
  //           //Last label verification
  //       if(i == arrLabel.length - 1){ 
  //         arrComponent[i]._isLast = true;
  //         arrComponent[i].upSound = "Você saiu da proteína!"
  //       }  
  //     }      
  //       else{ 
  //         arrComponent[i]._isFirst = true;
  //         arrComponent[i].downSound = "Você saiu da proteína!"
  //       }
  //   }
  // }
  // 
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

// focusViewer(){
//   document.getElementById('viewerHold').tabIndex = 0;
//   document.getElementById('viewerHold').focus();
// }
// lastBtnVerify(e){
//   if(e.keyCode == 9){
//     e.preventDefault();
//     (document.getElementById("menuList").childNodes[0].childNodes[0] as HTMLElement).focus();
//   }
//   else if(e.keyCode == 13){
//     this._route.navigate(['/menu']);
// }
// }

}