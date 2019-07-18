import { HttpClient,HttpParams,HttpHeaders} from '@angular/common/http';
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
  return this.http.get('http://johnnyloreano.pythonanywhere.com/getProtein', config);
  }
  requestTest(name:string) {
    const config = {
      params: {
          name: name
      }
  };
  return this.http.get('http://johnnyloreano.pythonanywhere.com/getTest', config);
  }
  requestRotation(points:Array<Object>, type:String){
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    const config = {
      params: {
          data: JSON.stringify(points),
          type: JSON.stringify(type)
      }
  };
    return this.http.get('http://johnnyloreano.pythonanywhere.com/getRotation', config)
  }
}