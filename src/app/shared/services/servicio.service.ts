import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { LoadingController } from '@ionic/angular';
import { tap, finalize, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  constructor(private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private loadingCtrl: LoadingController) { }

  getServicios(): Observable<any[]> {
    return this.afs.collection('servicios',
    ref => ref.orderBy('tipo', 'asc')).valueChanges();
  }

}
