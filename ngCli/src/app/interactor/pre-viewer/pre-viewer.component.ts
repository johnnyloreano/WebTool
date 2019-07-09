import { Component, OnInit } from '@angular/core';
import { DataService } from '../../core/data-service/data-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pre-viewer',
  templateUrl: './pre-viewer.component.html',
  styleUrls: ['./pre-viewer.component.css']
})
export class PreViewerComponent implements OnInit {

  constructor(private _data : DataService, private _router : Router) { }
  private protein = this._data.getProtein()
  ngOnInit() {
    if(this.protein == undefined)
      this._router.navigate(['/buscador']);
    document.getElementById("focus").focus();
  }

}
