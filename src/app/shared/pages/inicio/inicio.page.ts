import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { ServicioService } from '../../services/servicio.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  user: any;
  public folder: string;
  servicios: Observable<any[]>

  constructor(private auth: AuthService,
    private activatedRoute: ActivatedRoute,
    public router: Router,
    private services: ServicioService) { }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    this.auth.user.subscribe(data => {
      this.user = data;
    })
    this.mostrarServicios();
  }

  mostrarServicios() {
    this.servicios = this.services.getServicios();
  }

  trackByFn(index, obj) {
    return obj.uid;
  }

  abrirServicio(uid: string) {
    
  }

  solicitarServicio() {
    this.router.navigate([`solicitar`])
  }

}
