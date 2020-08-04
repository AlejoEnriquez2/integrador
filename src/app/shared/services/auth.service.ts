import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { switchMap, first, take, map } from "rxjs/operators";

import { GooglePlus } from '@ionic-native/google-plus/ngx';


import * as firebase from "firebase/app";
import { Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user: Observable<any>;
  
  constructor(private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private platform: Platform,
    private googlePlus: GooglePlus) { 

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
      await this.afAuth.createUserWithEmailAndPassword(email, password);

      const user = await this.afAuth.currentUser;
      return await user.updateProfile({
        displayName: name,
        photoURL: "https://goo.gl/7kz9qG"
      });
    } catch (err) {
      console.error("Error" +  JSON.stringify(err));
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

  async emailPasswordLogin(email: string, password: string): Promise<void> {
    try {
      const emailCredential = firebase.auth.EmailAuthProvider.credential(email, password);
      const firebaseUser = await firebase.auth().signInWithCredential(emailCredential);
      return await this.updateUserData(firebaseUser.user, "email");
    } catch (err) {
      return err;
    } 
  } 


  //-------------------------------------

  userExists(email: string) {
    console.log("userExists",email);
    return this.afs
      .collection("users", ref => ref.where("email", "==", email))
      .valueChanges()
      .pipe(first())
      .toPromise();
  }

  // Guardar datos del usuario en Firestore
  async updateUserData(usertemp: any, provider: any) {
    console.log("update", JSON.stringify(usertemp));
    const doc: any = await this.userExists(usertemp.email);
    let data: any;
    let user: any = JSON.parse(JSON.stringify(usertemp));

    console.log("doc", JSON.stringify(doc));
    if (doc == null || doc == "") {
      //Crear cuenta
      data = {
        uid: user.uid,
        email: user.email || null,
        displayName: user.displayName || '',
        photoURL: user.photoURL || "https://goo.gl/7kz9qG",
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
        displayName: user.displayName || '',
        photoURL: user.photoURL || "https://goo.gl/7kz9qG",
        provider: provider,
        lastLogin: new Date(Number(user.lastLoginAt)) || new Date()
      };
    }

    console.log("data", JSON.stringify(data))
    const userRef = this.afs.collection<any>('users');

    return userRef.doc(`${user.uid}`).set(data, { merge: true });
  } 

}
