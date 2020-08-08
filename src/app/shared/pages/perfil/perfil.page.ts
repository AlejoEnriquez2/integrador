import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  current_user: any
  usuario_uid: string
  calificacion

  comentarios: Observable<any>

  constructor(private auth: AuthService,
    private route: ActivatedRoute,
    private userservice: UsuarioService) { }

  ngOnInit() {
    this.usuario_uid = this.route.snapshot.paramMap.get('id')
    this.userservice.getUsuario(this.usuario_uid).subscribe(user => {
      this.current_user = user;

      if (user != null) {
        if (user.rol == "employee") {
          if (user.calificacion == 0) {
            this.calificacion = 0
          } else {
            this.calificacion = user.calificacion / user.numeroContratos
          }

          this.comentarios = this.userservice.getComentarios(this.usuario_uid)

        }
      }

    })
  }

  trackByFn(index, obj) {
    return obj.uid;
  }

}
