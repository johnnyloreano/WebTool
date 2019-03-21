import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class HttpService {
constructor(private http: HttpClient) {}
  requestTags(file: string) {
    const config = {
      params: {
          pdbFile: file
      }
  };
  return this.http.get('http://127.0.0.1:5000/dataTags', config);
  }
  requestAmino(aminoName: string) {
    const config = { params: {aminoName : aminoName}};
    return this.http.get('http://127.0.0.1:5000/dataAmino', config).toPromise();
  }
}