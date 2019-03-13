import { NgModule } from '@angular/core';
import { AppProviderRoute } from './app-routing';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { MenuModule} from './menu/menu.module';
import { InteractorModule } from './interactor/interactor.module';
import { SimpleModalModule } from 'ngx-simple-modal';
import { DataService } from './core/data-service/data-service.service';
@NgModule({
  declarations: [
    AppComponent
    ],
  imports: [
    AppProviderRoute,
    HttpClientModule,
    SharedModule,
    CoreModule.forRoot(),
    MenuModule,
    BrowserModule,
    InteractorModule,
    CoreModule,
    SimpleModalModule
  ],
  bootstrap: [AppComponent],
  providers: [DataService]
})

export class AppModule {
}
