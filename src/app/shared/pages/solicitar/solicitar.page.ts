import { Component, OnInit } from '@angular/core';
import { File } from '@ionic-native/file/ngx';
import { Solicitud } from '../../models/solicitud';
import { AuthService } from '../../services/auth.service';
import { SolicitudService } from '../../services/solicitud.service';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { tap, finalize, filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ServicioService } from '../../services/servicio.service';

@Component({
  selector: 'app-solicitar',
  templateUrl: './solicitar.page.html',
  styleUrls: ['./solicitar.page.scss'],
})
export class SolicitarPage implements OnInit {

  user: any;

  imagenes: any = [];
  urls: any = [];
  servicios: Observable<any[]>;
  solicitud: Solicitud = new Solicitud;

  constructor(private auth: AuthService,
    private file: File, 
    private solicitudService: SolicitudService,
    private servicioservice: ServicioService,
    public router: Router,
    private toastController: ToastController,
    private storage: AngularFireStorage,
    private loadingCtrl: LoadingController,
    private alertController: AlertController) { }

  ngOnInit() {
    this.auth.user.subscribe(data => {
      this.user = data;
      this.solicitud.uid_usuario = data.uid;
    })
    this.servicios = this.servicioservice.getServicios();
  }

  imagenCargada(e) {
    console.log("imagen cargada");
    this.imagenes.push(e);
  }

  async upload() {
    if (this.solicitud.servicios == undefined) {
      alert("Debe seleccionar por lo menos un tipo de servicio")
    } else {
      console.log(this.imagenes.length)

      if (this.imagenes.length > 0) {
        this.solicitudService.uploadFiles(this.imagenes)
        .then(async values => {
          if (values == null) {
            alert("error")
            return
          } else {
            this.imagenes.map(async file => {
              this.urls.push(file.url)
            })
            await this.ask()
          }
        })
        .catch(err => {
          console.error("Error ", JSON.stringify(err));
          alert(JSON.stringify(err))
        });
      } else {
        await this.ask();
      }

    }
  }

  async ask() {
    console.log("URLs", this.urls.length);
    if (this.urls.length == 0) {
      const alert = await this.alertController.create({
        header: '¿Seguro no deseas agregar imágenes para mostrar el trabajo final?',
        buttons: [
          {
            text: 'Agregar imágenes',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
            }
          }, {
            text: 'Enviar sin imágenes',
            handler: () => {
              this.guardarSolicitud()
            }
          }
        ]
      });
      await alert.present();
    } else {
      this.guardarSolicitud()
    } 
  }

  guardarSolicitud() {
    this.solicitud.galeria_antes = this.urls
    //var today = new Date()
    //var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    this.solicitud.fecha_inicio = new Date()
    this.solicitud.estado = 'solicitando'
    this.solicitudService.insertSolicitud(this.solicitud)
    this.toast('Servicio solicitado');
    this.router.navigate([`inicio`])
  }

  async toast(text: string, duration: number = 2500, position?) {
    const toast = await this.toastController.create({
      message: text,
      position: position || 'middle',
      duration: duration
    });
    toast.present();
  }


}
