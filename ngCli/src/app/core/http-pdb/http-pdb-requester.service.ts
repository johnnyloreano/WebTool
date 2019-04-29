import { HttpClient} from '@angular/common/http';
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
  requestTest(name:string) {
    const config = {
      params: {
          name: name
      }
  };
  return this.http.get('http://127.0.0.1:5000/dataTest', config);
  }
  requestDistances(){
    return this.http.get('http://127.0.0.1:5000/dataDistances');
  }
}