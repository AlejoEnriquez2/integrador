import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
})
export class ImageUploadComponent implements OnInit {

  @Input() type:string;
  @Input() icon:string;
  @Output() uploadFinished = new EventEmitter<any>();
  
  constructor(private camera: Camera) { }

  ngOnInit() {}

  async captureAndUpload(){
    console.log("camera");
    const options: CameraOptions = {
      quality: 33,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.type=='camera'?this.camera.PictureSourceType.CAMERA:this.camera.PictureSourceType.PHOTOLIBRARY
    } 

    console.log("options", options);
    const base64 = await this.camera.getPicture(options);
    
    this.uploadFinished.emit(base64);
  }

  

}