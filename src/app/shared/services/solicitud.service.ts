import { Injectable } from '@angular/core';
import { Solicitud } from '../models/solicitud';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import {File} from "@ionic-native/file/ngx";
import { first, map } from 'rxjs/operators';
import { Respuesta } from '../models/respuesta';
import { Comentario } from '../models/comentario';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {

  constructor(private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private loadingCtrl: LoadingController,
    private file: File,
    private router: Router) { }

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

  getSolicitudByUsuario(tipo: string, uid_usuario: string, estado: string): Observable<any[]> {
    return this.afs.collection('solicitudes',
    ref => ref.where(tipo, "==", uid_usuario).where("estado", "==", estado)).valueChanges();
  }

  getMisRespuestas(uid_empresa: string) {
    return this.afs.collectionGroup('respuestas', ref =>
    ref.where("uid_empresa", "==", uid_empresa))
    .valueChanges()
  }

  getSolicitud(uid: string): Observable<any>{
    let itemDoc = this.afs.doc<any>(`solicitudes/${uid}`);
    return itemDoc.valueChanges();
  }

  getRespuestas(uid_solicitud: string): Observable<any>{
    const ref = this.afs.collection('solicitudes').doc(uid_solicitud)
    return ref.collection('respuestas').valueChanges()
  }

  getRespuesta(uid_solicitud: string, uid_respuesta: string): Observable<any>{
    const ref = this.afs.collection('solicitudes').doc(uid_solicitud)
    return ref.collection('respuestas').doc(uid_respuesta).valueChanges()
  }

  getRespuestas2(uid_solicitud: string) {
    console.log('getres2')
    const ref = this.afs.collection('solicitudes').doc(uid_solicitud)
    return ref.collection('respuestas').snapshotChanges().pipe(map(res => {
      console.log('res2', res)
    }))
  }

  /*getUsuariosByRespuesta(uid_list: any[]): Observable<any[]>  {
    console.log('get ', uid_list)
    return this.afs.collection('users', ref =>
    ref.where("uid", "in", uid_list)).valueChanges()
  }*/

  tieneRespuesta(uid_empresa: string, uid_solicitud: string) {
    let bandera = false
    const ref = this.afs.collection('solicitudes').doc(uid_solicitud)
    return ref.collection('respuestas',
    ref => ref.where("uid_empresa", "==", uid_empresa))
    .valueChanges()
    .pipe(first())
    .toPromise();
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

  fileSize(sizeInBytes: number) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let power = Math.round(Math.log(sizeInBytes) / Math.log(1024));
    power = Math.min(power, units.length - 1);

    const size = sizeInBytes / Math.pow(1024, power); // size in new units
    const formattedSize = Math.round(size * 100) / 100; // keep up to 2 decimals
    const unit = units[power];

    return size ? `${formattedSize} ${unit}` : '0';
  }

  enviarRespuesta(respuesta: Respuesta) {
    if (respuesta.mensaje == "" || respuesta.mensaje == null)
      respuesta.mensaje = "Hola! Me encantaría ayudarte."
    const refRespuesta = this.afs.collection('solicitudes')
    respuesta.uid = this.afs.createId()
    const param = JSON.parse(JSON.stringify(respuesta));
    refRespuesta.doc(respuesta.uid_solicitud).collection<any>("respuestas").doc(respuesta.uid).set(param, {merge:true})
  }

  mergeSolicitud(solicitud: Solicitud) {
    const ref = this.afs.collection('solicitudes')
    const param = JSON.parse(JSON.stringify(solicitud));
    ref.doc(solicitud.uid).set(param, {merge: true})
  }

  enviarCalificacion(solicitud: Solicitud, comentario: Comentario) {
    this.mergeSolicitud(solicitud)
    const ref = this.afs.collection('users')
    comentario.uid = this.afs.createId()
    const param = JSON.parse(JSON.stringify(comentario));
    ref.doc(comentario.uid_empresa).collection<any>("comentarios").doc(comentario.uid).set(param, {merge:true})
  }

}
