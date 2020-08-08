import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SolicitudService } from '../../services/solicitud.service';
import { UsuarioService } from '../../services/usuario.service';
import { Respuesta } from '../../models/respuesta';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertController, ToastController, ModalController } from '@ionic/angular';
import { Solicitud } from '../../models/solicitud';
import { ChatComponent } from '../../../components/chat/chat.component';

@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.page.html',
  styleUrls: ['./solicitud.page.scss'],
})
export class SolicitudPage implements OnInit {

  solicitud: Observable<any>
  respuestas: Observable<any>
  empresas = []
  //empresas: { [uid: string]: any} = {}
  ids: any[] = []
  usuario: Observable<any>
  current_user: any
  //current_user: Observable<any>

  id: string

  no_respuestas: number = 0
  enviar: boolean = false
  mensaje: boolean = true

  res: string

  respuesta: Respuesta = new Respuesta;
  solicitudAceptada: Solicitud = new Solicitud;

  constructor(private afs: AngularFirestore,
    private route: ActivatedRoute,
    private solicitudService: SolicitudService,
    private usuarioService: UsuarioService,
    private router: Router,
    private auth: AuthService,
    private toastController: ToastController,
    private alertController: AlertController,
    private modal: ModalController) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')
    this.solicitud = this.solicitudService.getSolicitud(this.id)
    this.respuesta.uid_solicitud = this.id

    this.solicitud.subscribe(data => {
      this.usuario = this.usuarioService.getUsuario(data.uid_usuario)
      this.respuesta.uid_usuario = data.uid_usuario
      this.solicitudAceptada.uid_usuario = data.uid_usuario
      this.solicitudAceptada.descripcion = data.descripcion
      this.solicitudAceptada.fecha_inicio = data.fecha_inicio
      this.solicitudAceptada.galeria_antes = data.galeria_antes
      this.solicitudAceptada.servicios = data.servicios
    })
    this.solicitudAceptada.uid = this.id

    this.auth.user.subscribe(async user => {
      this.current_user = user;

      if (this.current_user != null)
        if (this.current_user.rol == "employee") {

          this.respuesta.uid_empresa = this.current_user.uid
          const bandera: any = await this.solicitudService.tieneRespuesta(this.current_user.uid, this.respuesta.uid_solicitud)
          if (bandera != null && bandera != "") {
            console.log("bandera", bandera)
            this.res = bandera[0].uid
            this.cambiarEstado()
          }

        } else {

          this.respuestas = this.solicitudService.getRespuestas(this.id)

          this.respuestas.subscribe(respuestas => {
            this.no_respuestas = respuestas.length
            this.empresas.splice(0, this.empresas.length)
            for (let respuesta of respuestas) {
              let u = this.usuarioService.getUsuario(respuesta.uid_empresa)
              u.subscribe(datos => {
                let contratado
                let calificacion
                if (datos.numeroContratos == 0) {
                  contratado = false
                  calificacion = 0
                } else {
                  contratado = true
                  calificacion = datos.calificacion / datos.numeroContratos
                }
                let nueva_respuesta = {
                  uid_sender: datos.uid,
                  name_sender: datos.displayName,
                  contratado: contratado,
                  calificacion_sender: calificacion,
                  URL_sender: datos.photoURL,
                  mensaje: respuesta.mensaje,
                  uid_respuesta: respuesta.uid,
                  uid_solicitud: respuesta.uid_solicitud
                }
                this.empresas.push(nueva_respuesta)
              })
            }
          })
        }

    })
  }

  trackByFn(index, obj) {
    return obj.uid;
  }

  async presentAlert() {

    const alert = await this.alertController.create({
      header: 'Puedes enviar un mensaje!',
      message: 'Indica en qué puedes ayudar, explica por qué eres el mejor para este trabajo (:',
      inputs: [
        {
          name: 'msg',
          type: 'textarea',
          placeholder: 'Hola! Me encantaría ayudarte.'
        }],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Enviar!',
          handler: (alertData) => {
            this.enviarAyuda(alertData.msg)
          }
        }
      ]
    });

    await alert.present();
  }

  enviarAyuda(msg) {
    this.respuesta.fecha = new Date()
    this.respuesta.mensaje = msg
    this.solicitudService.enviarRespuesta(this.respuesta)
    this.cambiarEstado()
  }

  cambiarEstado() {
    this.enviar = true
    this.mensaje = false
  }

  enviarMensaje(respuesta_uid, solicitud_uid) {
    console.log("modal", respuesta_uid)
    this.modal.create({
      component: ChatComponent,
      componentProps : {
        respuesta: respuesta_uid,
        solicitud: solicitud_uid
      }
    }).then((modal) => modal.present())
  }

  async aceptarAlert(uid_empresa) {

    this.solicitud.subscribe(async data => {
      if (data.estado != "solicitando") {
        this.toast('Ya has contratado a alguien para esta tarea!');
      } else {
        const alert = await this.alertController.create({
          header: 'Agenda tu cita',
          message: 'Indica la fecha para realizar el trabajo',
          inputs: [
            {
              name: 'date',
              type: 'date'
            }],
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
                console.log('Confirm Cancel');
              }
            }, {
              text: 'Enviar!',
              handler: (alertData) => {
                this.aceptarEmpresa(alertData.date, uid_empresa)
              }
            }
          ]
        });

        await alert.present();
      }
    })
  }

  aceptarEmpresa(fecha, uid_empresa) {
    this.solicitudAceptada.estado = 'espera'
    this.solicitudAceptada.fecha_agenda = new Date()
    this.solicitudAceptada.fecha_cita = fecha
    this.solicitudAceptada.uid_empleado = uid_empresa
    this.solicitudService.mergeSolicitud(this.solicitudAceptada)
    this.router.navigate(['trabajos']);
  }

  async toast(text: string, duration: number = 2500, position?) {
    const toast = await this.toastController.create({
      message: text,
      position: position || 'middle',
      duration: duration
    });
    toast.present();
  }

  verMas(uid) {
    console.log("vermas")
    this.router.navigate([`perfil/${uid}`])
  }

}
