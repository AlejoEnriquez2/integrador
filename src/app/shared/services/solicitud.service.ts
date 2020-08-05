import { Injectable } from '@angular/core';
import { Solicitud } from '../models/solicitud';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { LoadingController } from '@ionic/angular';
import { tap, finalize, filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {File} from "@ionic-native/file/ngx";

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {

  constructor(private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private loadingCtrl: LoadingController,
    private file: File) { }

  insertSolicitud(solicitud: Solicitud) {
    const refSolicitud = this.afs.collection('solicitudes')
    solicitud.uid = this.afs.createId()
    const param = JSON.parse(JSON.stringify(solicitud));
    refSolicitud.doc(solicitud.uid).set(param, {merge: true})
  }

  getSolicitudes(): Observable<any[]> {
    return this.afs.collection('solicitudes',
    ref => ref.where("estado", "==", "solicitando")).valueChanges();
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


  getSolicitud(uid: string): Observable<any>{
    let itemDoc = this.afs.doc<any>(`solicitudes/${uid}`);
    return itemDoc.valueChanges();
  }

  async getSolicitudById(uid:string): Promise<Solicitud>{
    try{
      let aux:any = await this.afs.collection('solicitudes',
      ref => ref.where('uid', '==', uid))
      .valueChanges().pipe(first()).toPromise().then(doc => {
        return doc;
      }).catch(error => {
        throw error;
      });
      if (aux.length == 0)
        return undefined;
      return aux[0];
    } catch(error) {
      console.error("Error", error);
      throw error;
    }
  }





  
  uploadFiles(files: any[]) {
    return Promise.all(
      files.map(async file => {
        if (file.type === "image") return await this.imageUpload(file);
        else return await this.fileUpload(file);
      })
    )
      .then(values => {
        return values;
      })
      .catch(err => {
        console.error("Error" , JSON.stringify(err));
        return null;
      });
  }

  async imageUpload(file) {
    return await new Promise(async (resolve, reject) => {
      let ref = this.storage.ref(file.ref);
      let task: any = await ref.putString(file.file, "data_url");

      let downloadURL = ref.getDownloadURL();
      await downloadURL.subscribe(url => {
        file.url = url;
        file.file = null;
        resolve(file);
      });
    });
  }
  
  async fileUpload(file) {
    return await new Promise(async (resolve, reject) => {
      this.file
        .resolveLocalFilesystemUrl(file.file)
        .then(newUrl => {
          let dirPath = newUrl.nativeURL;
          let dirPathSegments = dirPath.split("/");
          dirPathSegments.pop();
          dirPath = dirPathSegments.join("/");
          this.file.readAsArrayBuffer(dirPath, newUrl.name).then(async buffer => {
            let blob = new Blob([buffer], {type: "audio/m4a"});
            try {
              let ref = this.storage.ref(file.ref);
              let task: any = await ref.put(blob);

              let downloadURL = ref.getDownloadURL();
              await downloadURL.subscribe(url => {
                file.url = url;
                file.file = null;
                file.size = this.fileSize(buffer.byteLength);
                resolve(file);
              });
            } catch (err) {
              console.error("Error" , JSON.stringify(err));
              resolve(null);
            }
          });
        })
        .catch(error => {
          console.error("Error" , JSON.stringify(error));
          resolve(null);
        });
    });
  }
}
