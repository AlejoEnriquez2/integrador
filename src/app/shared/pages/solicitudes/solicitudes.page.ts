import { Component, OnInit } from '@angular/core';
import { SolicitudService } from '../../services/solicitud.service';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.page.html',
  styleUrls: ['./solicitudes.page.scss'],
})
export class SolicitudesPage implements OnInit {

  solicitudes: Observable<any>
  usuario: any

  no_solicitudes: number = 0

  constructor(private solicitudService: SolicitudService,
    private auth: AuthService,
    public router: Router) { }

  ngOnInit() {
    this.auth.user.subscribe(async data => {
      this.usuario = data;
      if (data != null) {
        this.solicitudes = this.solicitudService.getSolicitudByUsuario("uid_usuario", data.uid, "solicitando")
        this.solicitudes.subscribe(data => {
          this.no_solicitudes = data.length
        })
      }
    })
  }

  trackByFn(index, obj) {
    return obj.uid;
  }

  abrirSolicitud(id) {
    this.router.navigate([`solicitud/${id}`])
  }

}