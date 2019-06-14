import { Component } from '@angular/core';
import {HttpService as pdbRequester} from '../../core/http-pdb/http-pdb-requester.service';
import {DataService} from '../../core/data-service/data-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-testes',
  templateUrl: './testes.component.html',
  styleUrls: ['./testes.component.css']
})
export class TestesComponent {

  constructor(private _pdb: pdbRequester, private _router: Router, private _dataS : DataService) { }

/**
 * Recebe o nome da figura geométrica desejada ,faz a busca por ela no Python e navega à página do gráfico
 * @param name 
 * 
 */
  request(name:string){
    this._pdb.requestTest(name).subscribe(
      (result) => {
        this._dataS.setTest(result);
        this._dataS.setSeletor('test');
        this._router.navigate(['viewTest']);
      }
    )
  }
}
