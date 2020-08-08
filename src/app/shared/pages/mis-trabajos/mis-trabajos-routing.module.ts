import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MisTrabajosPage } from './mis-trabajos.page';

const routes: Routes = [
  {
    path: '',
    component: MisTrabajosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MisTrabajosPageRoutingModule {}
