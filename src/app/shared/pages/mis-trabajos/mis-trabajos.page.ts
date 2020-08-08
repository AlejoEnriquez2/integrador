import { Component, OnInit } from '@angular/core';
import { SolicitudService } from '../../services/solicitud.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-mis-trabajos',
  templateUrl: './mis-trabajos.page.html',
  styleUrls: ['./mis-trabajos.page.scss'],
})
export class MisTrabajosPage implements OnInit {
  trabajos: Observable<any>
  current_user: any
  proximos = []

  constructor(private solicitudService: SolicitudService,
    private auth: AuthService,
    public router: Router,
    private usuarioService: UsuarioService,
    private photoViewer: PhotoViewer) { }

  ngOnInit() {
    this.auth.user.subscribe(async user => {
      this.current_user = user;
      if (user != null) {
        this.trabajos = this.solicitudService.getSolicitudByUsuario("uid_empleado", user.uid, "espera")

        this.trabajos.subscribe(data => {
          this.proximos.splice(0, this.proximos.length)
          for (let aux of data) {
            let u = this.usuarioService.getUsuario(aux.uid_usuario)
            u.subscribe(datos => {
              let nuevo_trabajo = {
                uid_empresa: datos.uid,
                name_empresa: datos.displayName,
                URL_empresa: datos.photoURL,
                descripcion: aux.descripcion,
                galeria_antes: aux.galeria_antes,
                fecha_cita: aux.fecha_cita
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

}