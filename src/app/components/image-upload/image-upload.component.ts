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
    const file = await this.camera.getPicture(options);
    
    let byteCharacters = atob(file);
    const path = `solicitudes/${new Date().getTime()}`;
    let image = 'data:image/jpg;base64,'+file;

    const data = {
      ref: path,
      type: "image",
      uploaderType: "client",
      url: null,
      name: "image",
      file: image,
      size: this.fileSize(Number(byteCharacters.length))
    }
    
    this.uploadFinished.emit(data);
  }

  fileSize(sizeInBytes: number) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let power = Math.round(Math.log(sizeInBytes) / Math.log(1024));
    power = Math.min(power, units.length - 1);

    const size = sizeInBytes / Math.pow(1024, power); // size in new units
    const formattedSize = Math.round(size * 100) / 100; // keep up to 2 decimals
    const unit = units[power];

    return size ? `${formattedSize} ${unit}` : '0';
  }

  

}