import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SolicitudService } from '../../services/solicitud.service';
import { Respuesta } from '../../models/respuesta';

@Component({
  selector: 'app-inicio-e',
  templateUrl: './inicio-e.page.html',
  styleUrls: ['./inicio-e.page.scss'],
})
export class InicioEPage implements OnInit {

  user: any;
  servicios = []
  solicitudes: Observable<any[]>

  resultados = []

  constructor(private auth: AuthService,
    private activatedRoute: ActivatedRoute,
    public router: Router,
    public solicitudservice: SolicitudService) { }

  ngOnInit() {
    this.auth.user.subscribe(user => {
      this.user = user;
      if (user != null) {
        this.servicios = user.servicios;
        this.solicitudes = this.solicitudservice.getSolicitudes();

        this.solicitudes.subscribe(data => {
          this.resultados.splice(0, this.resultados.length)
          for (let aux of data) {
            let a = this.servicios.filter(value => aux.servicios.includes(value))
            if (a.length > 0)
              this.resultados.push(aux)
          }
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
  /*
    enviarAyuda(uid_usuario, uid_solicitud) {
      let respuesta: Respuesta = new Respuesta
      respuesta.uid_solicitud = uid_solicitud
      respuesta.uid_usuario = uid_usuario
      respuesta.uid_empresa = this.user.uid
      
      this.solicitudservice.enviarRespuesta(respuesta)
    }*/

}
