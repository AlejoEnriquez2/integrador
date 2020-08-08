
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Empresa } from '../models/empresa';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private afs: AngularFirestore) { }
  
  getUsuario(uid: string): Observable<any>{
    let itemDoc = this.afs.doc<any>(`users/${uid}`);
    return itemDoc.valueChanges();
  }
  
  getComentarios(uid: string): Observable<any>{
    let ref = this.afs.doc<any>(`users/${uid}`);
    return ref.collection("comentarios").valueChanges();
  }

  actualizarEmpresa(empresa: Empresa) {
    console.log("calificacion",empresa.calificacion)
    console.log("no",empresa.numeroContratos)
    const ref = this.afs.collection('users')
    const param = JSON.parse(JSON.stringify(empresa));
    ref.doc(empresa.uid).set(param, {merge: true})
  }
}