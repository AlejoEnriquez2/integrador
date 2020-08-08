import { Component, OnInit } from '@angular/core';
import { SolicitudService } from '../../services/solicitud.service';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-respuestas',
  templateUrl: './respuestas.page.html',
  styleUrls: ['./respuestas.page.scss'],
})
export class RespuestasPage implements OnInit {

  respuestas: Observable<any>
  empresa: any

  constructor(private solicitudService: SolicitudService,
    private auth: AuthService) { }

  ngOnInit() {
    this.auth.user.subscribe(async data => {
      this.empresa = data;
      if (data != null) {
        this.respuestas = this.solicitudService.getMisRespuestas(data.uid);
      }
    })

  }

  trackByFn(index, obj) {
    return obj.uid;
  }

  mostrar() {
    this.respuestas.subscribe(data => {
      console.log(data)
    })
  }

}
