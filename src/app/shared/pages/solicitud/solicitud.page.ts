import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SolicitudService } from '../../services/solicitud.service';
import { UsuarioService } from '../../services/usuario.service';
import { Respuesta } from '../../models/respuesta';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.page.html',
  styleUrls: ['./solicitud.page.scss'],
})
export class SolicitudPage implements OnInit {

  solicitud: Observable<any>
  usuario: Observable<any>
  empresa: any

  id: string

  class: string = ''
  enviar: boolean = false
  mensaje: boolean = true

  respuesta: Respuesta = new Respuesta;

  constructor(private route: ActivatedRoute,
    private solicitudService: SolicitudService,
    private usuarioService: UsuarioService, 
    private router: Router,
    private auth: AuthService) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')
    this.solicitud = this.solicitudService.getSolicitud(this.id)
    this.respuesta.uid_solicitud = this.id
    this.solicitud.subscribe(data => {
      this.usuario = this.usuarioService.getUsuario(data.uid_usuario)
      this.respuesta.uid_usuario = data.uid_usuario
    })
    this.auth.user.subscribe(async data => {
      this.empresa = data;
      this.respuesta.uid_empresa = data.uid
      const bandera: any = await this.solicitudService.tieneRespuesta(data.uid, this.respuesta.uid_solicitud) 
      if (bandera != null && bandera !=  "") {
        this.cambiarEstado()
      }
    })
  }

  enviarAyuda() {
    this.solicitudService.enviarRespuesta(this.respuesta)
    this.cambiarEstado()
  }

  cambiarEstado() {
    this.enviar = true
    this.mensaje = false
  }

  enviarMensaje() {
    this.router.navigate(['mensajes']);
  }

}