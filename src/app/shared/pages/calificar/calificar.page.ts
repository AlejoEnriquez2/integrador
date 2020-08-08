import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Comentario } from '../../models/comentario';
import { Solicitud } from '../../models/solicitud';
import { SolicitudService } from '../../services/solicitud.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-calificar',
  templateUrl: './calificar.page.html',
  styleUrls: ['./calificar.page.scss'],
})
export class CalificarPage implements OnInit {

  imagenes: any = [];
  urls: any = [];
  empresa_uid: string
  usuario_uid: string
  solicitud_uid: string

  rate: number = 2

  solicitud: Solicitud = new Solicitud
  comentario: Comentario = new Comentario

  constructor(private router: Router,
    private solicitudService: SolicitudService,
    private toastController: ToastController,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.empresa_uid = this.route.snapshot.paramMap.get('empresa')
    this.usuario_uid = this.route.snapshot.paramMap.get('usuario')
    this.solicitud_uid = this.route.snapshot.paramMap.get('solicitud')

    console.log(this.empresa_uid, "-", this.usuario_uid, "-", this.solicitud_uid)
  }

  onModelChange(rate) {
    console.log(rate)
  }

  imagenCargada(e) {
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
            await this.guardarSolicitud()
          }
        })
        .catch(err => {
          console.error("Error ", JSON.stringify(err));
          alert(JSON.stringify(err))
        });
      } else {
        await this.guardarSolicitud();
      }

    }
  }

  guardarSolicitud() {
    this.comentario.galeria_antes = this.urls
    //var today = new Date()
    //var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    this.comentario.fecha = new Date()
    this.solicitudService.enviarCalificacion(this.solicitud, this.comentario)
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
