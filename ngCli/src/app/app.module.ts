import { NgModule } from '@angular/core';
import { AppProviderRoute } from './app-routing';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { MenuModule} from './menu/menu.module';
import { ProteinViewerComponent } from './protein-viewer/protein-viewer.component';

 
@NgModule({
  declarations: [
    AppComponent,
    ProteinViewerComponent
  ],
  imports: [
    AppProviderRoute, 
    HttpClientModule,
    SharedModule,
    CoreModule.forRoot(),
    MenuModule,
    BrowserModule
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
