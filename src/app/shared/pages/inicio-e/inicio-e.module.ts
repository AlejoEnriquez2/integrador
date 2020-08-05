import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InicioEPageRoutingModule } from './inicio-e-routing.module';

import { InicioEPage } from './inicio-e.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InicioEPageRoutingModule
  ],
  declarations: [InicioEPage]
})
export class InicioEPageModule {}
