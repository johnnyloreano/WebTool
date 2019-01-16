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
}