import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import {DataService} from '../../core/data-service/data-service.service'
import {Router} from '@angular/router'
@Component({  
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  private pdbContent : any;
  constructor(public dataService: DataService,private _route:Router) {}
  ngOnInit() {
    this.dataService.currentProtein.subscribe(pdbContent => this.pdbContent = pdbContent);
    if(this.pdbContent == undefined) this._route.navigate(["/"]);
  }
  teste(){
    this._route.navigate(["/proteinView"]);
  }
  // parseProtein(){
  //   this._domService.removeAllChild();
  //   let res = this.pdbContent.residues;
  //   for(let i = 0; i < res.length;i++){
  //     this._domService.addDynamicComponent(res[i])
  //   }
  // }
  // parseLabels(){
  //   this._domService.removeAllChild();
  //   let res = this.pdbContent.residues;
  //   let array: Array<any>;
  //   array = new Array();
  //   for(let i = 0; i < res.length;i++)
  //     array.push(res[i])
  //   this._domService.addArrayComponent(array);
  // }
  // parseInfo(){
  //   this._domService.removeAllChild();
  // }
}