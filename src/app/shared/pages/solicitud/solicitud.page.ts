import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SolicitudService } from '../../services/solicitud.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.page.html',
  styleUrls: ['./solicitud.page.scss'],
})
export class SolicitudPage implements OnInit {

  solicitud: Observable<any>
  usuario: Observable<any>

  id: string

  class: string = ''
  enviar: boolean = false
  mensaje: boolean = true

  constructor(private route: ActivatedRoute,
    private solicitudService: SolicitudService,
    private usuarioService: UsuarioService, 
    private router: Router) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')
    this.solicitud = this.solicitudService.getSolicitud(this.id)
    this.solicitud.subscribe(data => {
      this.usuario = this.usuarioService.getUsuario(data.uid_usuario)
    })
  }

  enviarAyuda() {
    this.enviar = true
    this.mensaje = false
  }

  enviarMensaje() {
    this.router.navigate(['mensajes']);
  }

}