import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { ProteinViewerComponent } from '../protein-viewer/protein-viewer.component';
import { MenuComponent } from './menu/menu.component';
export const routes: Routes = [
  { path: 'menu', pathMatch:'full', component: MenuComponent},
  { path: 'proteinView', pathMatch:'full', component: ProteinViewerComponent},
  { path: '', redirectTo: '/principal', pathMatch:'full'}
];
export const MenuProviderRoute:  ModuleWithProviders = RouterModule.forChild(routes);