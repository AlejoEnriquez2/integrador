import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MisTrabajosPageRoutingModule } from './mis-trabajos-routing.module';

import { MisTrabajosPage } from './mis-trabajos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MisTrabajosPageRoutingModule
  ],
  declarations: [MisTrabajosPage]
})
export class MisTrabajosPageModule {}
