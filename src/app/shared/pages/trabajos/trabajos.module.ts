import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrabajosPageRoutingModule } from './trabajos-routing.module';

import { TrabajosPage } from './trabajos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrabajosPageRoutingModule
  ],
  declarations: [TrabajosPage]
})
export class TrabajosPageModule {}
