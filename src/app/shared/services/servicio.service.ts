import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  constructor(private afs: AngularFirestore) { }

  getServicios(): Observable<any[]> {
    return this.afs.collection('servicios',
    ref => ref.orderBy('tipo', 'asc')).valueChanges();
  }
  
}
