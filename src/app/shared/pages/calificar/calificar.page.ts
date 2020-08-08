import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-calificar',
  templateUrl: './calificar.page.html',
  styleUrls: ['./calificar.page.scss'],
})
export class CalificarPage implements OnInit {

  empresa_uid: string
  usuario_uid: string
  solicitud_uid: string

  rate: number = 2

  constructor(private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.empresa_uid = this.route.snapshot.paramMap.get('empresa')
    this.usuario_uid = this.route.snapshot.paramMap.get('usuario')
    this.solicitud_uid = this.route.snapshot.paramMap.get('solicitud')

    console.log(this.empresa_uid, "-", this.usuario_uid, "-", this.solicitud_uid)
  }

  onModelChange(rate) {
    console.log(rate)
  }

}
