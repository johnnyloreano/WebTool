import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AminoModal } from "./amino-modal/amino-modal.component"
import { ProteinViewerComponent } from "./protein-viewer/protein-viewer.component"
import { AdDirective } from './host/a-host.directive';
import { CoreModule } from '../core/core.module'
import { SharedModule } from '../shared/shared.module'
import { BootstrapModalModule } from 'ng2-bootstrap-modal';
import { TranscripterService } from '../core/transcripter/transcripter.service';
import { TalkerService } from '../core/talker/talker.service';
import { BondComponent } from '../shared/bond/bond.component';
@NgModule({
  declarations: [ProteinViewerComponent,AminoModal,AdDirective, BondComponent],
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    BootstrapModalModule
  ],
  entryComponents: [AminoModal, BondComponent],
  providers: [TranscripterService,TalkerService]
})
export class InteractorModule { }
