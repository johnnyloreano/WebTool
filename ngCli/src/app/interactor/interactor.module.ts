import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProteinViewerComponent } from './protein-viewer/protein-viewer.component';
import { CoreModule } from '../core/core.module';
import { TranscripterService } from '../core/transcripter/transcripter.service';
import { TalkerService } from '../core/talker/talker.service';
import { RouterModule } from '@angular/router';
import { HighchartsChartComponent } from 'highcharts-angular';
import { SummaryComponent} from './summary/summary.component';
import { ProteinViewerTestComponent } from './protein-viewer-test/protein-viewer-test.component';
@NgModule({
  declarations: [ProteinViewerComponent,HighchartsChartComponent,SummaryComponent, ProteinViewerTestComponent],
  imports: [
    CommonModule,
    CoreModule,
    RouterModule
  ],
  providers: [TranscripterService, TalkerService]
})
export class InteractorModule { }
