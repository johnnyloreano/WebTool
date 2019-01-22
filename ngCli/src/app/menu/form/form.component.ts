import { Component, ɵConsole } from '@angular/core';
import { Router } from '@angular/router'
import { DataService } from '../../core/data-service/data-service.service';
import {HttpPdbRequesterService as pdbRequester} from '../../core/http-pdb/http-pdb-requester.service'

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})

export class FormComponent {
    private pdbFile : string = '';
    constructor(private _pdbRequester: pdbRequester, private _router :Router, public dataService:DataService) {}
  requestProtein(){
      this._pdbRequester.requestTags(this.pdbFile).subscribe( 
        result => {
          this.dataService.setProtein(result);  
          this._router.navigate(['/menu'])
      }
     )
  }
}