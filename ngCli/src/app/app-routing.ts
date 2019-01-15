import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { FormComponent } from './menu/form/form.component'
import { MenuComponent } from './menu/menu/menu.component';
import { LisinaComponent } from './shared/aminoacid/lisina/lisina.component';
export const routes: Routes = [
  {path: 'principal', component: FormComponent,},
  { path: '', redirectTo:'principal', pathMatch:'full'},
  { path: 'menu', loadChildren: './menu/menu.module#MenuModule'},
  { path: 'proteinView', loadChildren: './menu/menu.module#MenuModule'}
];
export const AppProviderRoute:  ModuleWithProviders = RouterModule.forRoot(routes);