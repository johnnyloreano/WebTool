import { NgModule, ModuleWithProviders } from '@angular/core';
import {DataService } from './data-service/data-service.service'
import {DomService } from './dom-service/dom-service.service'
import { HttpPdbRequesterService } from './http-pdb/http-pdb-requester.service'
@NgModule({
  providers: [DataService,DomService,HttpPdbRequesterService]
})
export class CoreModule { 
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [DataService,DomService,HttpPdbRequesterService]
    };
}
}