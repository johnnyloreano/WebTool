import { Component, OnInit } from '@angular/core';
import {HttpService as pdbRequester} from '../../core/http-pdb/http-pdb-requester.service';
import {DataService} from '../../core/data-service/data-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-testes',
  templateUrl: './testes.component.html',
  styleUrls: ['./testes.component.css']
})
export class TestesComponent implements OnInit {

  constructor(private _pdb: pdbRequester, private _router: Router, private _dataS : DataService) { }

  ngOnInit() {
  }

  requestTriangle(){
    this._pdb.requestTest().subscribe(
      (result) => {
        this._dataS.setTest(result);
        this._router.navigate(['viewTest']);
      }
    )
  }
}
