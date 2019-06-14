import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProteinViewerComponent } from './protein-viewer/protein-viewer.component';
import { CoreModule } from '../core/core.module';
import { TalkerService } from './talker/talker.service';
import { RouterModule } from '@angular/router';
import { HighchartsChartComponent } from 'highcharts-angular';
import { SummaryComponent} from './summary/summary.component';
import { PreViewerComponent } from './pre-viewer/pre-viewer.component';
@NgModule({
  declarations: [ProteinViewerComponent,HighchartsChartComponent,SummaryComponent, PreViewerComponent],
  imports: [
    CommonModule,
    CoreModule,
    RouterModule
  ],
  providers: [TalkerService]
})
export class InteractorModule { }
