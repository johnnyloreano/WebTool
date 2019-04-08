import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { FormComponent } from './menu/form/form.component';
import { MenuComponent } from './menu/menu/menu.component';
import { ProteinViewerComponent } from './interactor/protein-viewer/protein-viewer.component';
import { ProteinViewerTestComponent as ViewerTest } from './interactor/protein-viewer-test/protein-viewer-test.component';
import { SummaryComponent } from './interactor/summary/summary.component';
import { ManualComponent } from './menu/manual/manual.component';
import { TestesComponent } from './menu/testes/testes.component';

export const routes: Routes = [
  {path: 'menu', component: MenuComponent},
  {path: 'summary', component: SummaryComponent},
  {path: 'buscador', component: FormComponent},
  { path: 'manual', pathMatch: 'full', component: ManualComponent},
  { path: 'proteinView', pathMatch: 'full', component: ProteinViewerComponent},
  { path: 'testes', pathMatch: 'full', component: TestesComponent},
  { path: 'viewTest', pathMatch: 'full', component: ViewerTest},
  { path: '**', redirectTo: 'menu', pathMatch: 'full'}
];

export const AppProviderRoute:  ModuleWithProviders = RouterModule.forRoot(routes);
