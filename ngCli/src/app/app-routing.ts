import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { FormComponent } from './menu/form/form.component';
import { MenuComponent } from './menu/menu/menu.component';
import { ProteinViewerComponent } from './interactor/protein-viewer/protein-viewer.component';
import { ManualComponent } from './menu/manual/manual.component';

export const routes: Routes = [
  {path: 'menu', component: MenuComponent},
  {path: 'buscador', component: FormComponent},
  { path: 'manual', pathMatch: 'full', component: ManualComponent},
  { path: 'proteinView', pathMatch: 'full', component: ProteinViewerComponent},
  { path: '', redirectTo: 'principal', pathMatch: 'full'}
];

export const AppProviderRoute:  ModuleWithProviders = RouterModule.forRoot(routes);
