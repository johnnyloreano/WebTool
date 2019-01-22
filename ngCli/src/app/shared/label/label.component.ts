import { Component, OnInit, Input,Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-label',
  template: `
              <div tabindex="0" class="d-inline-block text-center label" >
                {{name}}
              </div>
              `,
  styleUrls: ['./label.component.css']
})
export class LabelComponent implements OnInit {
  @Input() name:string;
  private _y  : number = undefined;
  private _x  : number = undefined;
 
  private ariaDictionary = {
    "ALA":"Alanina A L A",
    "PHE":"Fenilalanina P H E",
    "ASN":"Asparagina A S N",
    "ARG":"Arginina A R G",
    "TYR":"Tirosina T Y R",
    "LEU":"Leucina L E U",
    "CYS":"Cisteina C Y S",
    "ILE":"Isoleucina I L E",
    "GLU":"AcidoGlutamico G L U",
    "SER":"Serina S E R",
    "ASP":"AcidoAspartico A S P",
    "GLY":"Glicina G L Y",
    "VAL":"Valina V A L",
    "PRO":"Prolina P R O",
    "TRP":"Triptofano T R P",
    "MET":"Metionina M E T",
    "TRE":"Treonina T R E",
    "GLN":"Glutamina G L N",
    "LYS":"Lisina L Y S",
    "HYS":"Histidina H Y S",
    "NH2":"NOTSUPPORTED"
  }
  ngOnInit(){}
  getPosArray(): Array<number>{
    return [this._x,this._y];
  }
  getName(){
  return this.name;
  }
  setName(name:any){
    this.name = name;
  }
  setPosition(y:number,x:number){
    this._x = x;
    this._y = y;
  }
  getPosition(){
    return {'position':'absolute', 'bottom': this._y+"%", 'left': this._x+"%" };
  }
  get Position(){
    return "X:"+ this._x+"%"+ "\nY:"+ this._y+"%";
  }
}