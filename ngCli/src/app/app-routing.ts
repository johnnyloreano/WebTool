import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { FormComponent } from './menu/form/form.component'
import { MenuComponent } from './menu/menu/menu.component';
import { ProteinViewerComponent } from './interactor/protein-viewer/protein-viewer.component'

export const routes: Routes = [
  {path: 'principal', component: FormComponent},
  { path: 'menu', pathMatch:'full', component: MenuComponent},
  { path: 'proteinView', pathMatch:'full', component:ProteinViewerComponent},
  
  { path: '', redirectTo:'principal', pathMatch:'full'}
];

export const AppProviderRoute:  ModuleWithProviders = RouterModule.forRoot(routes);