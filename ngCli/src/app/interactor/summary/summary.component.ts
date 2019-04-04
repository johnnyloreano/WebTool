import { Component, OnInit } from '@angular/core';
import { DataService } from '../../core/data-service/data-service.service';
import { Router } from "@angular/router";
@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent{
  private protein = this._dataS.getProtein();
  constructor(private _dataS : DataService,private _router : Router) { }
  goMenu(){
    this._router.navigate(['/menu']);
  }
}
