import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SolicitudService } from '../../services/solicitud.service';
import { UsuarioService } from '../../services/usuario.service';
import { Respuesta } from '../../models/respuesta';
import { AuthService } from '../../services/auth.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.page.html',
  styleUrls: ['./solicitud.page.scss'],
})
export class SolicitudPage implements OnInit {

  solicitud: Observable<any>
  respuestas: Observable<any>
  empresas 
  //empresas: { [uid: string]: any} = {}
  ids:any[] = []
  usuario: Observable<any>
  current_user: Observable<any>

  id: string

  no_respuestas: number = 0
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
            this.empresas = []
            for (let aux of data) {
              let u = this.usuarioService.getUsuario(aux.uid_empresa)
              u.subscribe(datos => {
                this.empresas.push(datos)
                console.log('aux', this.empresas)
              })
            }
          })
    
          /*this.respuestas.forEach(respuesta => {
            console.log("res", respuesta)
            console.log("res 0", respuesta[0].uid_empresa)
            let u = this.usuarioService.getUsuario(respuesta[0].uid_empresa)
            u.subscribe(datos => {
              //this.usuarios.push(datos)
              this.empresas[respuesta[0].uid_empresa] = datos
            })
          })*/

          console.log('usuarios', this.empresas)
          //this.usuarios = this.solicitudService.getUsuariosByRespuesta(this.ids)

        }

      })
    })
  }

  trackByFn(index, obj) {
    return obj.uid;
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