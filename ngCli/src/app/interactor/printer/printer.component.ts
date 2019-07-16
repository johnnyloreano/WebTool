import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery/dist/jquery.min.js';
import { DataService } from 'src/app/core/data-service/data-service.service';
import { Router } from '@angular/router';

declare var iCn3DUI : any;

@Component({
  selector: 'app-printer',
  templateUrl: './printer.component.html',
  styleUrls: ['./printer.component.css']
})
export class PrinterComponent implements OnInit {

  constructor(private _dataService : DataService, private _router: Router) { }

  ngOnInit() {
    if(this._dataService.getProtein() == undefined)
      this._router.navigate(['/menu']);
  }
  generateFile(){
    let component = this;
    var hackDiv = document.createElement("div"); 
    hackDiv.id = "icn3dwrap";
    document.body.appendChild(hackDiv);

    $( document ).ready(function() {
       //Options are available at: https://www.ncbi.nlm.nih.gov/Structure/icn3d/icn3d.html#DisplayOptions
       let opts = {};
       opts['chemicals'] = 'nothing';              //line, stick, ball and stick, schematic, sphere, nothing
       opts['water']   = 'nothing';            //sphere, dot, nothing
       opts['ions']    = 'nothing'; 
       opts['hbonds']  = 'no';                 //yes, no
       opts['ssbonds'] = 'no';                //yes, no
       var cfg = {
           divid: 'icn3dwrap',
           width: '100%',
           height: '100%',
           showmenu: false
       };
       cfg['pdbid'] = component._dataService.getProtein().identifier;
       cfg['options'] = opts;
       var icn3dui = new iCn3DUI(cfg);
       
       //communicate with the 3D viewer with chained functions
       $.when(icn3dui.show3DStructure()).then(function() {
          icn3dui.exportStlFile("");
          document.getElementById("icn3dwrap").remove();
       });
    });
 }
}