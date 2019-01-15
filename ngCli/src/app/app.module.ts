import { NgModule } from '@angular/core';
import { AppProviderRoute } from './app-routing';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { MenuModule} from './menu/menu.module';
import { ProteinViewerComponent } from './protein-viewer/protein-viewer.component';
import { ModalAminoAcidComponent } from './modal-amino-acid/modal-amino-acid.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
 
@NgModule({
  declarations: [
    AppComponent,
    ProteinViewerComponent,
    ModalAminoAcidComponent
  ],
  imports: [
    AppProviderRoute, 
    HttpClientModule,
    SharedModule,
    CoreModule.forRoot(),
    MenuModule,
    BrowserModule,
    NgbModule
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
