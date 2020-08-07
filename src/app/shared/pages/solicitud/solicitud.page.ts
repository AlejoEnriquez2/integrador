import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SolicitudService } from '../../services/solicitud.service';
import { UsuarioService } from '../../services/usuario.service';
import { Respuesta } from '../../models/respuesta';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';
import { Solicitud } from '../../models/solicitud';

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
  ids:any[] = []
  usuario: Observable<any>
  current_user: Observable<any>

  id: string

  no_respuestas: number = 0
  enviar: boolean = false
  mensaje: boolean = true

  respuesta: Respuesta = new Respuesta;
  solicitudAceptada: Solicitud = new Solicitud;

  constructor(private afs: AngularFirestore,
    private route: ActivatedRoute,
    private solicitudService: SolicitudService,
    private usuarioService: UsuarioService, 
    private router: Router,
    private auth: AuthService,
    private alertController: AlertController) { }

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
    
    //this.auth.user.subscribe(user => {
    //  this.current_user = user;
    
    this.auth.getCurrentUser().then(user => {
      this.current_user = this.auth.user;
      this.current_user.subscribe(async data => {

        if (data.rol == "employee") {

          this.respuesta.uid_empresa = data.uid
          const bandera: any = await this.solicitudService.tieneRespuesta(data.uid, this.respuesta.uid_solicitud) 
          if (bandera != null && bandera !=  "") {
            this.cambiarEstado()
          }

        } else {

          this.respuestas = this.solicitudService.getRespuestas(this.id)
          
          //obtener número de respuestas
          this.respuestas.subscribe(data => {
            this.no_respuestas = data.length
            this.empresas.splice(0, this.empresas.length)
            for (let aux of data) {
              let u = this.usuarioService.getUsuario(aux.uid_empresa)
              u.subscribe(datos => {
                let nueva_respuesta = {
                  uid_sender: datos.uid,
                  name_sender: datos.displayName,
                  calificacion_sender: datos.calificacion,
                  URL_sender: datos.photoURL,
                  mensaje: aux.mensaje
                }
                this.empresas.push(nueva_respuesta)
                //this.empresas[aux.uid_empresa] = datos
              })
            }
          })
        }

      })
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

  enviarMensaje(empresaUid) {
    this.router.navigate([`mensajes/${empresaUid}`])
  }

  verMas(solicitudUid, empresaUid) {

  }

  async aceptarAlert(uid_empresa) {
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

  aceptarEmpresa(fecha, uid_empresa) {
    this.solicitudAceptada.estado = 'espera'
    this.solicitudAceptada.fecha_agenda = new Date()
    this.solicitudAceptada.fecha_cita = fecha
    this.solicitudAceptada.uid_empleado = uid_empresa
    this.solicitudService.mergeSolicitud(this.solicitudAceptada)
    this.router.navigate(['trabajos']);
  }

}
