import { Injectable } from '@angular/core';
import { Solicitud } from '../models/solicitud';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { LoadingController } from '@ionic/angular';
import { tap, finalize, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {

  constructor(private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private loadingCtrl: LoadingController) { }

  insertSolicitud(solicitud: Solicitud) {
    const refSolicitud = this.afs.collection('solicitudes')
    solicitud.uid = this.afs.createId()
    const param = JSON.parse(JSON.stringify(solicitud));
    refSolicitud.doc(solicitud.uid).set(param, {merge: true})
  }

  async startUpload(file: string){
    let byteCharacters = atob(file);
    const path = `solicitudes/${new Date().getTime()}`;
    let image = 'data:image/jpg;base64,'+file;
    

    try{
      let ref = this.storage.ref(path);    
      let task = ref.putString(image, 'data_url');
      const loading = await this.loadingCtrl.create({
        message: 'Espere, subiendo fotografía...'
      });  
      await loading.present(); 

      //Listener de progreso de carga
      task.percentageChanges().pipe(
        filter(val => val === 100),
        tap(complete => {
          setTimeout(() => {
            loading.dismiss();
          }, 3500);
        })
      ).subscribe();

      task.snapshotChanges().pipe(
        finalize(() => {
          let downloadURL = ref.getDownloadURL()
          downloadURL.subscribe(url => {
            return url;
          });
        })
      )
      .subscribe();
    }catch(error){
      console.error(JSON.stringify(error));
      console.error("error ");
    }
    
  }

  /**
   * Redondea un número de bytes a un tamaño legible
   * @param sizeInBytes Número de bytes
   */
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
