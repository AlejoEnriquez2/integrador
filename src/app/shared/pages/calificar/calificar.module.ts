import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalificarPageRoutingModule } from './calificar-routing.module';

import { CalificarPage } from './calificar.page';
import { ImageUploadComponent } from '../../../components/image-upload/image-upload.component';
import { IonicRatingModule } from 'ionic-rating';
import { RatingComponent } from '../../../components/rating/rating.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicRatingModule,
    CalificarPageRoutingModule
  ],
  declarations: [CalificarPage, ImageUploadComponent, RatingComponent],
  exports: [ImageUploadComponent, RatingComponent]
})
export class CalificarPageModule {}
