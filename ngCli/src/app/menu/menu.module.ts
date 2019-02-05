import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule} from '@angular/forms';
import { FormComponent } from './form/form.component';
import { MenuComponent } from './menu/menu.component';
import { CoreModule } from '../core/core.module'
import { RouterModule } from '@angular/router';
import { HttpService } from '../core/http-pdb/http-pdb-requester.service';
@NgModule({
  declarations: [
    FormComponent,
    MenuComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    CoreModule,
    RouterModule
  ],
  providers: [HttpService]
})
export class MenuModule {}