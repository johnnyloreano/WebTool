import { NgModule, ModuleWithProviders } from '@angular/core';
import {DataService } from './data-service/data-service.service'
import { HttpService } from './http-pdb/http-pdb-requester.service'
import { TalkerService } from './talker/talker.service';
import { TranscripterService } from './transcripter/transcripter.service';
@NgModule({
  providers: [DataService,HttpService]
})
export class CoreModule { 
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [DataService,HttpService, TalkerService,TranscripterService]
    };
}
}