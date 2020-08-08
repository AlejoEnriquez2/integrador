import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TutorialEmpresasPageRoutingModule } from './tutorial-empresas-routing.module';

import { TutorialEmpresasPage } from './tutorial-empresas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TutorialEmpresasPageRoutingModule
  ],
  declarations: [TutorialEmpresasPage]
})
export class TutorialEmpresasPageModule {}
