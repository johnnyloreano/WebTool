import { Component, OnInit, ViewChild, ComponentFactoryResolver, Renderer2, ElementRef} from '@angular/core';
import { DataService } from '../../core/data-service/data-service.service';
import { AdDirective } from '../host/a-host.directive';
import { Router } from '@angular/router';
import { AminoModal } from '../amino-modal/amino-modal.component';
import { DialogService } from 'ng2-bootstrap-modal';
import {TranscripterService} from '../../core/transcripter/transcripter.service';
import { LabelResidueComponent } from '../../shared/label-residue/label-residue.component';
@Component({
  selector: 'app-protein-viewer',
  styleUrls : ['./protein.css'],
  template: `
            <h2 tabindex='0'>
              Nome da molécula: {{proteinName}}
            </h2>
              <a tabindex='0' class='btn bg-primary text-white' (click)="goPrincipal()"
              (keydown)="$event.keyCode == 13 ? goPrincipal() : null">
                Voltar ao menu principal
              </a>
            <div id='viewerHold'>
              <svg #svg></svg>
              <ng-template a-host ></ng-template>
            </div>
            `
})
export class ProteinViewerComponent implements OnInit {

  @ViewChild(AdDirective) host: AdDirective;
  @ViewChild('svg') svgHost: ElementRef;
  private proteinName: string;
  constructor(private _componentFactoryResolver: ComponentFactoryResolver,
              private _dataService: DataService, private _route: Router,
              private _dialogService: DialogService, private _transcripter: TranscripterService,
              private _renderer: Renderer2) { }
  ngOnInit() {
    if (this._dataService.getProtein() === undefined) {
      this._route.navigate(['/']);
    }
    this.loadComponent();
  }
  loadComponent() {
    const protein = this._dataService.getProtein();
    this.proteinName = protein.identifier;
    const arrLabel = protein.residues;
    const pos = protein.alphaLoc;
    const helix_range = protein.helix_range;
    const sheet_range = protein.sheet_range;
    let actualHelix = 0;
    let actualSheet = 0;
    const hasHelix = helix_range.length > 0 ;
    const hasSheet = sheet_range.length > 0 ;
    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(LabelResidueComponent);
    const viewContainer = this.host.viewContainerRef;
    const arrComponent = Array<LabelResidueComponent>();
    viewContainer.clear();
    const totalWidth = (document.getElementById('viewerHold').clientWidth);
    const totalHeight = (document.getElementById('viewerHold').clientHeight);
    for (let i = 0; i < arrLabel.length; i++) {
      const componentRef = viewContainer.createComponent(componentFactory);
      arrComponent.push(componentRef.instance);
      // Amino's plot
      const positionPlot = [totalWidth * pos[i][0] / 100, totalHeight * pos[i][1] / 100];
      arrComponent[i].position = positionPlot;
      (<LabelResidueComponent>componentRef.instance).initials = protein.residues[i].initials;
      // arrComponent[i].openModal.subscribe(this.openModal);
      // arrComponent[i]._parent = this;
      if (i > 0) {
        // Sound placement
        this.soundPlacement(arrComponent[i], arrComponent[i - 1]);
        // Helix verification
        if (hasHelix && actualHelix < helix_range.length) {
          this.helixVerifier(arrComponent[i], arrLabel[i].number, helix_range[actualHelix]);
          if (arrComponent[i]._isLastHelix) { actualHelix++; }
          if (arrComponent[i]._isHelix || arrComponent[i]._isLastHelix) {
            this.sinePlot(arrComponent[i].position, arrComponent[i - 1].position);
          }
        }
        // Sheet verification
        if (hasSheet && actualSheet < sheet_range.length) {
          this.sheetVerifier(arrComponent[i], arrLabel[i].number, sheet_range[actualSheet]);
          if (arrComponent[i]._isLastSheet) { actualSheet++; }
        }
        // Last label verification
        if (i === arrLabel.length - 1) {
          arrComponent[i]._isLast = true;
          arrComponent[i].upSound = 'Você saiu da proteína!';
        }
      } else {
        arrComponent[i]._isFirst = true;
        arrComponent[i].downSound = 'Você saiu da proteína!';
      }
    }
  }
  soundPlacement(aminoActual: LabelResidueComponent, aminoPredecessor: LabelResidueComponent) {
    const transitions = this._transcripter.getTransition(aminoActual.position, aminoPredecessor.position);
    aminoActual.downSound = transitions[1];
    aminoPredecessor.upSound = transitions[0];
    console.log(aminoPredecessor._initials, '->', aminoActual._initials);
    console.log([transitions[0], transitions[1] ]);
    return ;
  }
  helixVerifier(res: LabelResidueComponent, resNum: number, helixArray: Array<number>) {
      if (resNum === helixArray[0]) {
        return res._isFirstHelix = true;
      } else if (resNum ===  helixArray[1]) {
        return res._isLastHelix = true;
      } else if (resNum > helixArray[0]) {
          return res._isHelix = true;
      }
  }
  sheetVerifier(res: LabelResidueComponent, resNum: number, sheetArray: Array<number>) {
    if (resNum === sheetArray[0]) {
      return res._isFirstSheet = true;
    } else if (resNum === sheetArray[1]) {
        return res._isLastSheet = true;
      } else if (resNum > sheetArray[0]) {
        return res._isSheet = true;
      }
  }
  sinePlot(pos1: Array<number>, pos2: Array<number>) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    this._renderer.setAttribute(line, 'x1', pos1[0] + '');
    this._renderer.setAttribute(line, 'y1', pos1[1] + '');
    this._renderer.setAttribute(line, 'x2', pos2[0] + '');
    this._renderer.setAttribute(line, 'y2', pos2[1] + '');
    this._renderer.setStyle(line, 'stroke-width', '1');
    this._renderer.setStyle(line, 'stroke', 'rgb(255,0,0)');
    this._renderer.setStyle(line, 'position', 'absolute');
    this._renderer.appendChild(this.svgHost.nativeElement, line);
  }
  openModal(args) {
    args['parent']._dialogService.addDialog(AminoModal, {aminoInitials : args['initials']}).subscribe();
  }
  goPrincipal() {
    this._route.navigate(['/principal']);
  }
}
