import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../core/data-service/data-service.service';
import {HttpService as pdbRequester} from '../../core/http-pdb/http-pdb-requester.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})

export class FormComponent {
    private pdbFile: string;
    constructor(private _pdbRequester: pdbRequester, private _router: Router, public dataService: DataService) {}
  requestProtein() {
      this._pdbRequester.requestTags(this.pdbFile).subscribe(
        (result) => {
          this.dataService.setProtein(result);
          this._router.navigate(['/menu']); },
        (error: HttpErrorResponse) => {
          const errEl = document.getElementById('messageError');
          errEl.style.visibility = 'visible';
          errEl.innerHTML = 'Um erro aconteceu. Verifique se o nome do identificador' +
                            ' da proteína está correto e/ou se você possui internet. Informações do erro:'
                            + error.message;
          errEl.focus();
        }
      );
  }
}
