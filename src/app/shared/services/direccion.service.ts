import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Direccion } from '../models/direccion';

@Injectable({
  providedIn: 'root'
})
export class DireccionService {

  constructor(private afs: AngularFirestore) { }

  insertDireccion(direccion: Direccion) {
      const refDireccion = this.afs.collection('users')
      direccion.uid = this.afs.createId()
      const param = JSON.parse(JSON.stringify(direccion));
      refDireccion.doc(direccion.uid_usuario).collection<any>("direcciones").doc(direccion.uid).set(param, {merge:true})
  }
}
