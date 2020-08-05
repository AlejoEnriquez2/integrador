import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SolicitudService } from '../../services/solicitud.service';

@Component({
  selector: 'app-inicio-e',
  templateUrl: './inicio-e.page.html',
  styleUrls: ['./inicio-e.page.scss'],
})
export class InicioEPage implements OnInit {

  user: any;
  solicitudes: Observable<any[]>

  constructor(private auth: AuthService,
    private activatedRoute: ActivatedRoute,
    public router: Router,
    private solicitudservice: SolicitudService) { }

  ngOnInit() {
    this.auth.user.subscribe(data => {
      this.user = data;
    })
    this.mostrarSolicitudes();
  }

  mostrarSolicitudes() {
    this.solicitudes = this.solicitudservice.getSolicitudes();
  }

  trackByFn(index, obj) {
    return obj.uid;
  }

  abrirSolicitud(id) {
    this.router.navigate([`solicitud/${id}`])
  }

}
