import { NgModule } from '@angular/core';
import { AppProviderRoute } from './app-routing';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { MenuModule} from './menu/menu.module';
import { ProteinViewerComponent } from './protein-viewer/protein-viewer.component';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';
import { ConfirmComponent } from './confirm-component/confirm-component.component';
import { FenilalaninaComponent } from './shared/aminoacid/fenilalanina/fenilalanina.component';
import { IsoleucinaComponent } from './shared/aminoacid/isoleucina/isoleucina.component';
import { LeucinaComponent } from './shared/aminoacid/leucina/leucina.component';
import { ArgininaComponent } from './shared/aminoacid/arginina/arginina.component';
import { AminoacidComponent } from './shared/aminoacid/aminoacid.component';
import { AlaninaComponent } from './shared/aminoacid/alanina/alanina.component';
import { AsparaginaComponent } from './shared/aminoacid/asparagina/asparagina.component';
import { CisteinaComponent } from './shared/aminoacid/cisteina/cisteina.component';
import { GlicinaComponent } from './shared/aminoacid/glicina/glicina.component';
import { GlutaminaComponent } from './shared/aminoacid/glutamina/glutamina.component';
import { HistidinaComponent } from './shared/aminoacid/histidina/histidina.component';
import { LisinaComponent } from './shared/aminoacid/lisina/lisina.component';
import { MetioninaComponent } from './shared/aminoacid/metionina/metionina.component';
import { TirosinaComponent } from './shared/aminoacid/tirosina/tirosina.component';
import { TreoninaComponent } from './shared/aminoacid/treonina/treonina.component';
import { TriptofanoComponent } from './shared/aminoacid/triptofano/triptofano.component';
import { ValinaComponent } from './shared/aminoacid/valina/valina.component';
import { ProlinaComponent } from './shared/aminoacid/prolina/prolina.component';
import { SerinaComponent } from './shared/aminoacid/serina/serina.component';
import { AcidoGlutamicoComponent } from './shared/aminoacid/acido-glutamico/acido-glutamico.component';
import { AcidoAsparticoComponent } from './shared/aminoacid/acido-aspartico/acido-aspartico.component';
import { AtomComponent } from './shared/atom/atom.component';
import { AutofocusDirective } from './auto-focus.directive';
@NgModule({
  declarations: [
    AppComponent,
    ProteinViewerComponent,
    ConfirmComponent,
    AutofocusDirective
    ],
  imports: [
    AppProviderRoute,     
    HttpClientModule,
    SharedModule,
    CoreModule.forRoot(),
    MenuModule,
    BrowserModule,
    BootstrapModalModule.forRoot({container:document.body})
  ],
entryComponents : [
  ConfirmComponent,AtomComponent,
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
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}