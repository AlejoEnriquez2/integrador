import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { UsuarioService } from '../../shared/services/usuario.service';
import { SolicitudService } from '../../shared/services/solicitud.service';
import { AuthService } from '../../shared/services/auth.service';
import { mensaje } from '../../shared/models/mensaje';
import { MensajeService } from '../../shared/services/mensaje.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {

  respuesta: string
  solicitud: string
  nombre: string
  uid_usuario: string
  uid_empresa: string
  me: string
  you: string

  chat: Observable<any>

  current_user: any

  mensaje: string

  constructor(private navparams: NavParams,
    private solicitudService: SolicitudService,
    private auth: AuthService,
    private usuarioService: UsuarioService,
    private modal: ModalController,
    private mensajeService: MensajeService) { }

  ngOnInit() {
    this.respuesta = this.navparams.get('respuesta')
    this.solicitud = this.navparams.get('solicitud')

    this.auth.user.subscribe(user => {
      this.me = user.uid

      this.chat = this.solicitudService.getRespuesta(this.solicitud, this.respuesta)
      this.chat.subscribe(respuesta => {
          this.uid_empresa = respuesta.uid_empresa
          this.uid_usuario = respuesta.uid_usuario
          if (this.me == this.uid_usuario)
            this.you = this.uid_empresa
          else
            this.you = this.uid_usuario
          this.usuarioService.getUsuario(this.you).subscribe(you => {
            this.nombre = you.displayName
          })
        })

    })
  }

  closeChat() {
    this.modal.dismiss()
  }

  send() {

    const mensaje: mensaje = {
      content: this.mensaje,
      date: new Date(),
      sender: this.me
    }

    this.mensajeService.send(mensaje, this.solicitud, this.respuesta);
    this.mensaje = '';
  }

}
