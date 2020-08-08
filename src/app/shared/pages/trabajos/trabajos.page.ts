import { Component, OnInit } from '@angular/core';
import { SolicitudService } from '../../services/solicitud.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { UsuarioService } from '../../services/usuario.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-trabajos',
  templateUrl: './trabajos.page.html',
  styleUrls: ['./trabajos.page.scss'],
})
export class TrabajosPage implements OnInit {

  trabajos: Observable<any>
  current_user: any
  proximos = []

  constructor(private solicitudService: SolicitudService,
    private auth: AuthService,
    public router: Router,
    private usuarioService: UsuarioService,
    private photoViewer: PhotoViewer,
    private alertController: AlertController) { }

  ngOnInit() {
    this.auth.user.subscribe(async user => {
      this.current_user = user;
      if (user != null) {
        this.trabajos = this.solicitudService.getSolicitudByUsuario("uid_usuario", user.uid, "espera")

        this.trabajos.subscribe(data => {
          this.proximos.splice(0, this.proximos.length)
          for (let solicitud of data) {
            let u = this.usuarioService.getUsuario(solicitud.uid_empleado)
            u.subscribe(empleado => {
              let nuevo_trabajo = {
                uid_empresa: empleado.uid,
                name_empresa: empleado.displayName,
                URL_empresa: empleado.photoURL,
                uid: solicitud.uid,
                uid_usuario: solicitud.uid_usuario,
                descripcion: solicitud.descripcion,
                galeria_antes: solicitud.galeria_antes,
                fecha_cita: solicitud.fecha_cita
              }
              this.proximos.push(nuevo_trabajo)
            })
          }
        })
      }
    })
  }

  trackByFn(index, obj) {
    return obj.uid;
  }

  zoom(url) {
    this.photoViewer.show(url)
  }

  async terminar(empresa, usuario, solicitud) {
    
    const alert = await this.alertController.create({
      header: '¿Se ha resulto tu problema?',
      message: 'Por favor, califica el servicio que has recibido y cuéntanos qué tal ha sido, tu opimión es muy importante',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Continuar',
          handler: (a) => {
            this.router.navigate([`calificar/${empresa}/${usuario}/${solicitud}`])
          }
        }
      ]
    });

    await alert.present();
  }

}