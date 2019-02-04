import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AminoModal } from "./amino-modal/amino-modal.component"
import { ProteinViewerComponent } from "./protein-viewer/protein-viewer.component"
import { AdDirective } from './host/a-host.directive';
import { CoreModule } from '../core/core.module'
import { AuditiveLabelComponent } from './auditive-label/auditive-label.component';
import { SharedModule } from '../shared/shared.module'
import { BootstrapModalModule } from 'ng2-bootstrap-modal';
import { TranscripterService } from '../core/transcripter/transcripter.service';
import { TalkerService } from '../core/talker/talker.service';
@NgModule({
  declarations: [ProteinViewerComponent,AminoModal,AdDirective,AuditiveLabelComponent],
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    BootstrapModalModule
  ],
  entryComponents: [AminoModal,AuditiveLabelComponent],
  providers: [TranscripterService,TalkerService]
})
export class InteractorModule { }
