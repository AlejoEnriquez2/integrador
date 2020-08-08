import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { mensaje } from '../models/mensaje';
import { firestore } from 'firebase';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MensajeService {

  constructor(private afs: AngularFirestore) { }

  send(mensaje: mensaje, uid_solicitud: string, uid_respuesta: string) {
    console.log("enviar", mensaje)
    const ref = this.afs.collection('solicitudes').doc(uid_solicitud)
    ref.collection('respuestas').doc(uid_respuesta).update({
          mensajes: firestore.FieldValue.arrayUnion(mensaje)
        })
  }

}
