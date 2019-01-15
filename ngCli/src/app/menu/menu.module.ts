import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule} from '@angular/forms';
import { FormComponent } from './form/form.component';
import { MenuComponent } from './menu/menu.component';
import { MenuProviderRoute } from './menu-routing';
import { LabelComponent } from '../shared/label/label.component';
import { AdDirective } from '../a-host.directive';
@NgModule({
  declarations: [
    FormComponent,
    MenuComponent,
    AdDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    MenuProviderRoute
  ],
  entryComponents:[
    FormComponent,
    MenuComponent,
    LabelComponent
  ],
  exports: [
    AdDirective
  ]
})
export class MenuModule {}