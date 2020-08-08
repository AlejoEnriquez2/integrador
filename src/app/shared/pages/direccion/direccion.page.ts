import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Direccion } from '../../models/direccion';
import { DireccionService } from '../../services/direccion.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-direccion',
  templateUrl: './direccion.page.html',
  styleUrls: ['./direccion.page.scss'],
})
export class DireccionPage implements OnInit {

  user: any;

  direccion: Direccion = new Direccion;

  constructor(private auth: AuthService,
    private direction: DireccionService,
    public router: Router,
    private toastController: ToastController) { }

  ngOnInit() {
    this.auth.user.subscribe(data => {
      this.user = data;
      this.direccion.uid_usuario = data.uid;
    })
    console.log(this.user)
  }

  agregarDireccion() {
    if (this.direccion.principal == undefined) {
      alert("La calle principal es un campo obligatorio!")
    } else if (this.direccion.referencia == undefined) {
      alert("La referencia es un campo obligatorio!")
    } else {
      this.direction.insertDireccion(this.direccion);
      this.toast('Te has registrado de forma exitosa!');
      this.router.navigate([`inicio`])   
    }

  }

  async toast(text: string, duration: number = 2000, position?) {
    const toast = await this.toastController.create({
      message: text,
      position: position || 'middle',
      duration: duration
    });
    toast.present();
  }

}
