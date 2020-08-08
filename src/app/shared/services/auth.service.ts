import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { switchMap, first, take, map } from "rxjs/operators";

import { GooglePlus } from '@ionic-native/google-plus/ngx';


import * as firebase from "firebase/app";
import { Platform, LoadingController } from '@ionic/angular';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class AuthService {


  public user: Observable<any>;
  loading: any;
  
  constructor(private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private platform: Platform,
    private googlePlus: GooglePlus,
    private loadingCtrl: LoadingController) { 

    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<any>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  async getCurrentUser(): Promise<any> {
    return this.user.pipe(first()).toPromise();
  }

  async signupUser(name: string, email: string, password: string): Promise<any> {
    try {
      this.loading = await this.loadingCtrl.create({
        message: 'Espere..'
      });  
      await this.loading.present();
      
      await this.afAuth.createUserWithEmailAndPassword(email, password);

      const user = await this.afAuth.currentUser;
      this.loading.dismiss();
      return await user.updateProfile({
        displayName: name,
        photoURL: "https://firebasestorage.googleapis.com/v0/b/contactosdb-e7de3.appspot.com/o/root%2Fuser.JPG?alt=media&token=1aadf8fe-8a67-440d-8fe3-e60e3051a4b6"
      });
    } catch (err) {
      console.error("Error" +  JSON.stringify(err));
      this.loading.dismiss();
      return err;
    }
  }

  
  async resetPassword(email: string): Promise<void> {
    try {
      return this.afAuth.sendPasswordResetEmail(email);
    } catch (err) {
      return err;
    } 
  } 

  async logout(): Promise<any> {
    return this.afAuth.signOut();
  } 

  /****************************************** LOGIN WITH GOOGLE ******************************************/

  async googleLogin() {
    if (this.platform.is("cordova")) {
      return await this.nativeGoogleLogin();
    } else {
      return await this.webGoogleLogin();
    }
  }

  async nativeGoogleLogin(): Promise<void> {
    try {
      const gplusUser: any = await this.googlePlus.login({
        webClientId: environment.googleWebClientId,
        offline: true
      });
      const googleCredential = firebase.auth.GoogleAuthProvider.credential(gplusUser.idToken);
      const firebaseUser = await firebase.auth().signInWithCredential(googleCredential);
      return await this.updateUserData(firebaseUser, "google");
    } catch (err) {
      console.error("Error Login google - native" + JSON.stringify(err));
      return err;
    }
  }

  async webGoogleLogin(): Promise<void> {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const credential = await this.afAuth.signInWithPopup(provider);
      return await this.updateUserData(credential.user, "google");
    } catch (err) {
      console.error("Error Login google - web" + JSON.stringify(err));
      return err;
    } 
  }

  /***************************************   EMAIL LOGIN *********************************/

  async emailPasswordLogin(email: string, password: string, rol): Promise<void> {
    try {
      this.loading = await this.loadingCtrl.create({
        message: 'Espere..'
      });  
      await this.loading.present();

      const emailCredential = firebase.auth.EmailAuthProvider.credential(email, password);
      const firebaseUser = await firebase.auth().signInWithCredential(emailCredential);
      if (rol === 'user') {
        this.loading.dismiss();
        return await this.updateUserData(firebaseUser.user, "email");
      } else {
        this.loading.dismiss();
        return await this.updateUserDataE(firebaseUser.user, "email");
      }
    } catch (err) {
      this.loading.dismiss();
      return err;
    } 
  } 


  //-------------------------------------

  userExists(email: string) {
    return this.afs
      .collection("users", ref => ref.where("email", "==", email))
      .valueChanges()
      .pipe(first())
      .toPromise();
  }

  // Guardar datos del usuario en Firestore
  async updateUserData(usertemp: any, provider: any) {
    const pathUser = "https://firebasestorage.googleapis.com/v0/b/contactosdb-e7de3.appspot.com/o/root%2Fuser.JPG?alt=media&token=1aadf8fe-8a67-440d-8fe3-e60e3051a4b6"
    const doc: any = await this.userExists(usertemp.email);
    let data: any;
    let user: any = JSON.parse(JSON.stringify(usertemp));

    if (doc == null || doc == "") {
      //Crear cuenta
      data = {
        uid: user.uid,
        rol: 'user',
        email: user.email || null,
        displayName: user.displayName || '',
        photoURL: user.photoURL || pathUser,
        provider: provider,
        lastLogin: new Date(Number(user.lastLoginAt)) || new Date(),
        createdAt: new Date(Number(user.createdAt)) || new Date()
      };
    } else if (doc.active == false) {
      throw { error_code: 999, error_message: "Acceso denegado, servicio deshabilitado, consulte con el administrador." };
    } else {
      //Actualizar cuenta
      data = {
        uid: user.uid,
        email: user.email || null,
        //displayName: user.displayName || '',
        //photoURL: user.photoURL || pathUser,
        provider: provider,
        lastLogin: new Date(Number(user.lastLoginAt)) || new Date()
      };
    }

    console.log("data", JSON.stringify(data))
    const userRef = this.afs.collection<any>('users');

    return userRef.doc(`${user.uid}`).set(data, { merge: true });
  } 

  // Guardar datos del usuario en Firestore
  async updateUserDataE(usertemp: any, provider: any) {
    const pathUser = "https://firebasestorage.googleapis.com/v0/b/contactosdb-e7de3.appspot.com/o/root%2Fuser.JPG?alt=media&token=1aadf8fe-8a67-440d-8fe3-e60e3051a4b6"
    const doc: any = await this.userExists(usertemp.email);
    let data: any;
    let user: any = JSON.parse(JSON.stringify(usertemp));

    if (JSON.stringify(doc).includes('"rol":"user"')) {
      throw { error_code: 998, error_message: "Acceso denegado, su cuenta no es de empresa." };
    } else if (doc.active == false) {
      throw { error_code: 999, error_message: "Acceso denegado, servicio deshabilitado, consulte con el administrador." };
    } else {
      //Actualizar cuenta
      data = {
        uid: user.uid,
        rol: 'employee',
        email: user.email || null,
        //displayName: user.displayName || '',
        //photoURL: user.photoURL || pathUser,
        provider: provider,
        lastLogin: new Date(Number(user.lastLoginAt)) || new Date()
      };
    }

    console.log("data", JSON.stringify(data))
    const userRef = this.afs.collection<any>('users');

    return userRef.doc(`${user.uid}`).set(data, { merge: true });
  } 

}
