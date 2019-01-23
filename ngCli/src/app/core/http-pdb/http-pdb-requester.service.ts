import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Injectable} from "@angular/core";

@Injectable({providedIn:'root'})
export class HttpPdbRequesterService {
constructor(private http: HttpClient){}
  requestTags(file : string){
    var config = {
      params: { 
          pdbFile: file
      }
  }
  return this.http.get('http://127.0.0.1:5000/dataTags',config);
  }
  requestAmino(amino : string){
    var config = { params: {aminoName : amino}}
    return this.http.get('http://127.0.0.1:5000/dataAmino', config);
  }
}