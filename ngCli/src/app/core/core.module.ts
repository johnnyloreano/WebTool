import { NgModule, ModuleWithProviders } from '@angular/core';
import {DataService } from './data-service/data-service.service'
import { HttpService } from './http-pdb/http-pdb-requester.service'
import { TalkerService } from './talker/talker.service';
import { TranscripterService } from './transcripter/transcripter.service';
import { DataParserService} from './data-parser/data-parser.service';
import { ChartConfiguratorService} from './chart-configurator/chart-configurator.service';
import { MathService} from './math/math.service';
@NgModule({
  providers: [DataService,HttpService,DataParserService,TranscripterService,ChartConfiguratorService,MathService]
})
export class CoreModule { 
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [DataService,HttpService, TalkerService,TranscripterService,DataParserService,MathService]
    };
}
}