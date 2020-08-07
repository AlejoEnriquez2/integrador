import { Component, OnInit } from '@angular/core';
import { SolicitudService } from '../../services/solicitud.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-trabajos',
  templateUrl: './trabajos.page.html',
  styleUrls: ['./trabajos.page.scss'],
})
export class TrabajosPage implements OnInit {

  trabajos: Observable<any>
  usuario: any
  proximos = []

  constructor(private solicitudService: SolicitudService,
    private auth: AuthService,
    public router: Router,
    private usuarioService: UsuarioService, 
    private photoViewer: PhotoViewer) { }

  ngOnInit() {
    this.auth.user.subscribe(async data => {
      this.usuario = data;
      this.trabajos = this.solicitudService.getSolicitudByUsuario("uid_usuario", data.uid, "espera")
      
      this.trabajos.subscribe(data => {
        this.proximos.splice(0, this.proximos.length)
        for (let aux of data) {
          let u = this.usuarioService.getUsuario(aux.uid_empleado)
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
            //this.empresas[aux.uid_empresa] = datos
          })
        }
      })
    })
  }

  trackByFn(index, obj) {
    return obj.uid;
  }

  zoom(url) {
    this.photoViewer.show(url)
  }

}