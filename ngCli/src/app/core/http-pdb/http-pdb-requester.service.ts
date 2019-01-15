import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Injectable} from "@angular/core";

@Injectable({providedIn:'root'})
export class HttpPdbRequesterService {
constructor(private http: HttpClient){}
  requestTags(file){
    var config = {
      params: { 
          pdbFile: file
      }
  }
  let result;
  return this.http.get('http://127.0.0.1:5000/dataParser',config);
  }
}