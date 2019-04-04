import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProteinViewerComponent } from './protein-viewer/protein-viewer.component';
import { AdDirective } from './host/a-host.directive';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { TranscripterService } from '../core/transcripter/transcripter.service';
import { TalkerService } from '../core/talker/talker.service';
import { RouterModule } from '@angular/router';
import { LabelResidueComponent } from '../shared/label-residue/label-residue.component';

@NgModule({
  declarations: [ProteinViewerComponent,  AdDirective, LabelResidueComponent],
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    RouterModule
  ],
  entryComponents:[LabelResidueComponent],
  providers: [TranscripterService, TalkerService]
})
export class InteractorModule { }
