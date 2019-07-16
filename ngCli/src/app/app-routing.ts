import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { FormComponent } from './menu/form/form.component';
import { MenuComponent } from './menu/menu/menu.component';
import { ProteinViewerComponent } from './interactor/protein-viewer/protein-viewer.component';
import { SummaryComponent } from './interactor/summary/summary.component';
import { ManualComponent } from './menu/manual/manual.component';
import { TestesComponent } from './menu/testes/testes.component';
import { PreViewerComponent } from './interactor/pre-viewer/pre-viewer.component';
import { PrinterComponent } from './interactor/printer/printer.component';

export const routes: Routes = [
  {path: 'menu', component: MenuComponent},
  {path: 'resumo', component: SummaryComponent},
  {path: 'buscador', component: FormComponent},
  { path: 'manual', pathMatch: 'full', component: ManualComponent},
  { path: 'proteinView', pathMatch: 'full', component: ProteinViewerComponent},
  { path: 'preView', pathMatch: 'full', component: PreViewerComponent},
  { path: 'testes', pathMatch: 'full', component: TestesComponent},
  { path: 'viewTest', pathMatch: 'full', component: ProteinViewerComponent},
  { path: 'printer', pathMatch: 'full', component: PrinterComponent},
  { path: '**', redirectTo: 'menu', pathMatch: 'full'}
];

export const AppProviderRoute:  ModuleWithProviders = RouterModule.forRoot(routes);
