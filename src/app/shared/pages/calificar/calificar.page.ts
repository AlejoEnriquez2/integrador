import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Comentario } from '../../models/comentario';
import { Solicitud } from '../../models/solicitud';
import { SolicitudService } from '../../services/solicitud.service';
import { ToastController, AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { Empresa } from '../../models/empresa';

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
  empresaCalificacion: Empresa = new Empresa

  rate: number = 2

  solicitud: Observable<any>
  empleado: Observable<any>
  usuario: any

  solicitudTerminada: Solicitud = new Solicitud
  comentario: Comentario = new Comentario

  constructor(private router: Router,
    private solicitudService: SolicitudService,
    private userService: UsuarioService,
    private toastController: ToastController,
    private auth: AuthService,
    private route: ActivatedRoute,
    private alertController: AlertController) { }

  ngOnInit() {
    this.empresa_uid = this.route.snapshot.paramMap.get('empresa')
    this.usuario_uid = this.route.snapshot.paramMap.get('usuario')
    this.solicitud_uid = this.route.snapshot.paramMap.get('solicitud')

    this.empleado = this.userService.getUsuario(this.empresa_uid)
    this.empleado.subscribe(empleado => {
      this.empresaCalificacion.uid = empleado.uid
      this.empresaCalificacion.calificacion = empleado.calificacion
      this.empresaCalificacion.displayName = empleado.displayName
      this.empresaCalificacion.email = empleado.email
      this.empresaCalificacion.fechaNacimiento = empleado.fechaNacimiento
      this.empresaCalificacion.lastLogin = empleado.lastLogin
      this.empresaCalificacion.numeroContratos = empleado.numeroContratos
      this.empresaCalificacion.photoURL = empleado.photoURL
      this.empresaCalificacion.provider = empleado.provider
      this.empresaCalificacion.rol = empleado.rol
      this.empresaCalificacion.servicios = empleado.servicios
    })

    this.solicitud = this.solicitudService.getSolicitud(this.solicitud_uid)
    this.solicitud.subscribe(data => {
      this.solicitudTerminada.descripcion = data.descripcion
      this.solicitudTerminada.fecha_agenda = data.fecha_agenda
      this.solicitudTerminada.fecha_cita = data.fecha_cita
      this.solicitudTerminada.fecha_inicio = data.fecha_inicio
      this.solicitudTerminada.galeria_antes = data.galeria_antes
      this.solicitudTerminada.servicios = data.servicios
      this.solicitudTerminada.uid = data.uid
      this.solicitudTerminada.uid_usuario = data.uid_usuario
      this.solicitudTerminada.uid_empleado = data.uid_empleado

      this.comentario.galeria_antes = data.galeria_antes
    })

    this.comentario.uid_usuario = this.usuario_uid
    this.comentario.uid_empresa = this.empresa_uid
  }

  onModelChange(rate) {
    console.log(rate)
  }

  imagenCargada(e) {
    this.imagenes.push(e);
  }

  calificar(e) {
    this.comentario.calificacion = e
    this.solicitudTerminada.calificacion = e
  }

  async upload() {

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

  async ask() {
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
              this.terminarSolicitud()
            }
          }
        ]
      });
      await alert.present();
    } else {
      this.terminarSolicitud()
    }
  }

  terminarSolicitud() {
    this.solicitudTerminada.galeria_despues = this.urls
    this.comentario.galeria_despues = this.urls
    this.solicitudTerminada.comentario = this.comentario.comentario
    this.solicitudTerminada.estado = 'terminada'
    this.comentario.fecha = new Date()
    this.empresaCalificacion.numeroContratos = this.empresaCalificacion.numeroContratos + 1
    this.empresaCalificacion.calificacion = this.empresaCalificacion.calificacion + this.comentario.calificacion


    if (this.comentario.calificacion == 0 || this.comentario.calificacion == null)
      alert("Por favor, califica el servicio que has recibido")
    else if (this.comentario.comentario == "" || this.comentario.comentario == null)
      alert("Por favor, coméntanos cómo ha sido el servicio")
    else {
      this.solicitudService.enviarCalificacion(this.solicitudTerminada, this.comentario)
      this.userService.actualizarEmpresa(this.empresaCalificacion)
      this.toast('Calificación enviada!');
      this.router.navigate([`inicio`])
    }
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
