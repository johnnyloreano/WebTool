import { NgModule } from '@angular/core';
import { AppProviderRoute } from './app-routing';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { BrowserModule } from '@angular/platform-browser';
import { MenuModule} from './menu/menu.module';
import { InteractorModule } from './interactor/interactor.module';
import { DataService } from './core/data-service/data-service.service';
import { BlankComponent } from './blank/blank.component';
@NgModule({
  declarations: [
    AppComponent,
    BlankComponent
    ],
  imports: [
    AppProviderRoute,
    HttpClientModule,
    CoreModule.forRoot(),
    MenuModule,
    BrowserModule,
    InteractorModule,
    CoreModule
  ],
  bootstrap: [AppComponent],
  providers: [DataService]
})

export class AppModule {
}
