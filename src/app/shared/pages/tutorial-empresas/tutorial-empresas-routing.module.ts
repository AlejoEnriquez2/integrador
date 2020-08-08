import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TutorialEmpresasPage } from './tutorial-empresas.page';

const routes: Routes = [
  {
    path: '',
    component: TutorialEmpresasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TutorialEmpresasPageRoutingModule {}
