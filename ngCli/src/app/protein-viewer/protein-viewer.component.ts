import { Component, OnInit, ViewChild, ComponentFactoryResolver, ComponentRef} from '@angular/core';
import { DataService } from '../core/data-service/data-service.service'
import { AdDirective } from '../a-host.directive'
import { LabelComponent } from '../shared/label/label.component'
import { Router } from '@angular/router';
import { ConfirmComponent } from '../confirm-component/confirm-component.component'
import { DialogService } from 'ng2-bootstrap-modal';
@Component({
  selector: 'app-protein-viewer',
  template: `
            <h2>
              Visualizador de proteína
            </h2>
            <h3> 
              Proteína: {{proteinName}} 
            </h3>
            <div [ngStyle]="{'position':'relative','background-color': '#ADD8E6', 'min-height': '80vh', 'width': '95%', 'margin':'0 auto'}">
              <ng-template a-host ></ng-template>
              <button (click)='openModal("aa")'>asd</button>
            </div>
            `
})
export class ProteinViewerComponent implements OnInit {
  
  private aminoNames = ['ALA','PHE','GLU','CYS','LYS','GLY','ASN','ASP','LEU','ILE','PRO','THR','TYR','ARG','MET','TRP','HIS','LYS','GLN','SER'];
  @ViewChild(AdDirective) host: AdDirective;
  constructor(private _componentFactoryResolver: ComponentFactoryResolver, private _dataService : DataService, private _route : Router, private _dialogService: DialogService) { }
  ngOnInit() {
    if(this._dataService.getProtein() == undefined)
      this._route.navigate(["/"]);
    this.loadComponent();
  }
  loadComponent(){
    let protein = this._dataService.getProtein();
    let arrLabel = protein.residues;
    let pos = protein.alphaLoc;
    
    let helix_range = protein.helix_range;
    let sheet_range = protein.sheet_range;
    
    let actualHelix = 0;
    let actualSheet = 0;

    let componentFactory = this._componentFactoryResolver.resolveComponentFactory(LabelComponent);
    let viewContainer = this.host.viewContainerRef;
    let arrComponent = Array<LabelComponent>();
    
    viewContainer.clear();
    for(let i = 0; i < arrLabel.length;i++){
      if(this.aminoNames.includes(arrLabel[i].initials) ){
        let componentRef = viewContainer.createComponent(componentFactory);
        arrComponent.push(componentRef.instance);
        //Amino's plot
        arrComponent[i].setPosition(pos[i][1],pos[i][0]);
        (<LabelComponent>componentRef.instance).name = protein.residues[i].initials;
        //arrComponent[i].openModal.subscribe(this.openModal)
        arrComponent[i].parent = this
        if(i > 0){
          //Sound placement
          let transitions = this.getTransition(arrComponent[i].getPosArray(),arrComponent[i-1].getPosArray());
          arrComponent[i].downSound = transitions[0];
          arrComponent[i-1].upSound = transitions[1];

          //Helix verification
          if(helix_range.length > 0){
            if (arrLabel[i].number == helix_range[actualHelix][0]){
              arrComponent[i].isFirstHelix = true
            }
            else if (arrLabel[i].number == helix_range[actualHelix][1]){
              arrComponent[i].isLastHelix = true
              actualHelix++
            }
            else if (arrLabel[i].number > helix_range[actualHelix][0]){
            arrComponent[i].isHelix = true
          }
        }
        //Sheet verification
          if(sheet_range.length > 0){
            if (arrLabel[i].number == sheet_range[actualSheet][0]){
              arrComponent[i].isFirstSheet = true
            }
            else if (arrLabel[i].number == sheet_range[actualSheet][1]){
              arrComponent[i].isLastSheet = true
              actualSheet++
            }
            else if (arrLabel[i].number > sheet_range[actualSheet][0]){
            arrComponent[i].isSheet = true
            }
          }
        }
        else if(i == arrLabel.length) arrComponent[i].isLast = true;
        else arrComponent[i].isFirst = true;
      }
    }
  }

  getTan(pos1:Array<number>, pos2:Array<number>) : number{ 
    let val = (pos2[1] - pos1[1]) / (pos2[0] - pos1[0]);
    return val;
  }

  getDegree(pos1:Array<number>, pos2:Array<number>) : number{
  let val = this.getTan(pos1,pos2);
  let valInv = 1 / val;
  val = Math.atan(val) * 180 / Math.PI;
  valInv = Math.atan(valInv) * 180 / Math.PI
    return Math.trunc(Math.abs(val)) ;
  }

  getInverseDegree(pos1:Array<number>, pos2:Array<number>) : number{
    return Math.abs(this.getDegree(pos1,pos2) - 90 )
  }

  toHour(degree: number): number[]{
    let aux = (degree/30);
    let hour = Math.trunc(aux);
    let min = (aux - hour) * 0.6;
    min = (this.round(Math.trunc(min * 100))) / 100 
    if (min == .6){
      min = 0; hour++;
    }
    let val = new Date();
    val.setHours(hour);
    val.setMinutes(min*100)
    return [hour,min];
  }

  round(val:number) : number{
    let newVal = Math.round(val / 10 )
    newVal *= 10
    return newVal 
  }

  getDelta(val:number,val2:number) : number{
    return val2 - val;
  }

  getQuadrant(pos:number[], posRelative: number[]) : number{ // Pega o quadrante do SEGUNDO parâmetro
    let posX = this.getDelta(pos[0],posRelative[0]);
    let posY = this.getDelta(pos[1],posRelative[1]);
    switch(true){
      case (posX > 0 && posY > 0): //
        return 1;
      case (posX < 0 && posY > 0): //
        return 2
      case (posX < 0 && posY < 0): //
        return 3;
      case (posX > 0 && posY < 0): //
        return 4;
      default:
        return 0;
    }
  }

  getCalculateDegree(degree:number,quadrant:number){
      let auxMult;
      switch(quadrant){
      case (1) : auxMult = 0 ;break; 
      case (2) : auxMult = 3; break;
      case (3) : auxMult = 2;break;
      case (4) : auxMult = 1; break;
      }
    return degree + (auxMult * 90);
  }

  createText(hour: number, minutes: number) : string{
    let text:string = "";
    //Casos isolados
    if(hour == 0)
      return "Subindo";
    if(hour == 3)
      return "Indo para a direita"
    if(hour == 9)
      return "Indo para a esquerda"
    if(hour == 6)
      return "Descendo";

    //Casos comuns
    else {   
    switch(true){
      case (hour <= 2 || hour >= 11):
      text = "Subindo ";
      break;
      case (hour > 2 && hour <= 5):
      text = "Indo para a direita "
      break;
      case (hour > 5 && hour <= 8):
      text = "Descendo "
      break;
      case (hour > 8 && hour < 11):
      text = "Indo para a esquerda "
      break;
    }

  }
    text += hour + " horas e ";
    text += 100*minutes + " minutos";
    
    return text;
  }

  getTransition(pos:number[], pos2:number[]){//Retorna os dados para o feedback sonoro

    let degrees = [ this.getDegree(pos,pos2),
                    this.getInverseDegree(pos2,pos)]; // degrees[0] = grau usando eixo x de pos, degrees[1] = grau usando eixo x de pos2
    let quadrants = [ this.getQuadrant(pos,pos2),
                      this.getQuadrant(pos2,pos)]; // quadrants[0] = quadrante de pos, quadrants[1] = quadrante de pos2
    let calculateDegrees = [  this.getCalculateDegree(degrees[0],quadrants[0]),
                              this.getCalculateDegree(degrees[0],quadrants[1])];
    let hours = [ this.toHour(calculateDegrees[0]), 
                  this.toHour(calculateDegrees[1]) ]
    let message = [ this.createText(hours[0][0],hours[0][1]),
                    this.createText(hours[1][0], hours[1][1]) ];

    return message;
  }

  openModal(args){
    let auxParent: ProteinViewerComponent;
    auxParent = args['parent'];
    let disposable = auxParent._dialogService.addDialog(ConfirmComponent, {aminoInitials : args['name']}).subscribe((isConfirmed)=>{
        //We get modal result
        if(isConfirmed) {
            alert('accepted');
        }
        else {
            alert('declined');
        }
    });
  }
}