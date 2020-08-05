
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private afs: AngularFirestore) { }
  
  getUsuario(uid: string): Observable<any>{
    let itemDoc = this.afs.doc<any>(`users/${uid}`);
    return itemDoc.valueChanges();
  }
}