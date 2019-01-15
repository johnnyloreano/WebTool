import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AminoacidComponent} from './aminoacid/aminoacid.component'
import { AlaninaComponent } from './aminoacid/alanina/alanina.component';
import { ArgininaComponent } from './aminoacid/arginina/arginina.component';
import { AsparaginaComponent } from './aminoacid/asparagina/asparagina.component';
import { CisteinaComponent } from './aminoacid/cisteina/cisteina.component';
import { FenilalaninaComponent } from './aminoacid/fenilalanina/fenilalanina.component';
import { GlicinaComponent } from './aminoacid/glicina/glicina.component';
import { GlutaminaComponent } from './aminoacid/glutamina/glutamina.component';
import { HistidinaComponent } from './aminoacid/histidina/histidina.component';
import { LeucinaComponent } from './aminoacid/leucina/leucina.component';
import { IsoleucinaComponent } from './aminoacid/isoleucina/isoleucina.component';
import { LisinaComponent } from './aminoacid/lisina/lisina.component';
import { MetioninaComponent } from './aminoacid/metionina/metionina.component';
import { TirosinaComponent } from './aminoacid/tirosina/tirosina.component';
import { TreoninaComponent } from './aminoacid/treonina/treonina.component';
import { TriptofanoComponent } from './aminoacid/triptofano/triptofano.component';
import { ValinaComponent } from './aminoacid/valina/valina.component';
import { ProlinaComponent } from './aminoacid/prolina/prolina.component';
import { SerinaComponent } from './aminoacid/serina/serina.component';
import { AcidoGlutamicoComponent } from './aminoacid/acido-glutamico/acido-glutamico.component';
import { AcidoAsparticoComponent } from './aminoacid/acido-aspartico/acido-aspartico.component';
import { LabelComponent } from './label/label.component';
import { AtomComponent } from './atom/atom.component'
import { TableInfoComponent } from './table-info/table-info.component' 
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
import { BondComponent } from '../bond/bond.component';
import { DoubleBondComponent } from '../double-bond/double-bond.component';
import { TripleBondComponent } from '../triple-bond/triple-bond.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [ 
    BondComponent,
    DoubleBondComponent,
    TripleBondComponent,
    AtomComponent,
    TableInfoComponent,
    AminoacidComponent,
    AlaninaComponent,
    ArgininaComponent,
    AsparaginaComponent,
    CisteinaComponent,
    FenilalaninaComponent,
    GlicinaComponent,
    GlutaminaComponent,
    HistidinaComponent,
    LeucinaComponent,
    IsoleucinaComponent,
    LisinaComponent,
    MetioninaComponent,
    TirosinaComponent,
    TreoninaComponent,
    TriptofanoComponent,
    ValinaComponent,
    ProlinaComponent,
    SerinaComponent,
    AcidoGlutamicoComponent,
    AcidoAsparticoComponent,
    LabelComponent,
  ],
  exports: [
    AtomComponent,
    TableInfoComponent,
    AminoacidComponent,
    AlaninaComponent,
    ArgininaComponent,
    AsparaginaComponent,
    CisteinaComponent,
    FenilalaninaComponent,
    GlicinaComponent,
    GlutaminaComponent,
    HistidinaComponent,
    LeucinaComponent,
    IsoleucinaComponent,
    LisinaComponent,
    MetioninaComponent,
    TirosinaComponent,
    TreoninaComponent,
    TriptofanoComponent,
    ValinaComponent,
    ProlinaComponent,
    SerinaComponent,
    AcidoGlutamicoComponent,
    AcidoAsparticoComponent,
    LabelComponent
  ],
  entryComponents: [    
    AtomComponent,
    TableInfoComponent,
    AminoacidComponent,
    AlaninaComponent,
    ArgininaComponent,
    AsparaginaComponent,
    CisteinaComponent,
    FenilalaninaComponent,
    GlicinaComponent,
    GlutaminaComponent,
    HistidinaComponent,
    LeucinaComponent,
    IsoleucinaComponent,
    LisinaComponent,
    MetioninaComponent,
    TirosinaComponent,
    TreoninaComponent,
    TriptofanoComponent,
    ValinaComponent,
    ProlinaComponent,
    SerinaComponent,
    AcidoGlutamicoComponent,
    AcidoAsparticoComponent,
    LabelComponent]
})
export class SharedModule { }
