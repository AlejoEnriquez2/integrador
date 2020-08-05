import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SolicitarPageRoutingModule } from './solicitar-routing.module';

import { SolicitarPage } from './solicitar.page';
import { ImageUploadComponent } from '../../../components/image-upload/image-upload.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SolicitarPageRoutingModule
  ],
  declarations: [SolicitarPage, ImageUploadComponent],
  exports: [ImageUploadComponent]
})
export class SolicitarPageModule {}
