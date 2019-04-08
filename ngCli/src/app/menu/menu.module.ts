import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule} from '@angular/forms';
import { FormComponent } from './form/form.component';
import { MenuComponent } from './menu/menu.component';
import { CoreModule } from '../core/core.module'
import { RouterModule } from '@angular/router';
import { HttpService } from '../core/http-pdb/http-pdb-requester.service';
import { ManualComponent } from './manual/manual.component';
import { TestesComponent } from './testes/testes.component';
@NgModule({
  declarations: [
    FormComponent,
    MenuComponent,
    ManualComponent,
    TestesComponent
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