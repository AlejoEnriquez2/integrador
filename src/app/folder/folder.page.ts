import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {

  correo: string;
  contrasena: string;

  constructor(private auth: AuthService,
    private router: Router) { }

  ngOnInit() { }

  async login() {
    let error = await this.auth.emailPasswordLogin(this.correo, this.contrasena, 'user');
    if (this.correo == undefined || this.contrasena == undefined) {
      alert("Todos los campos son obligatorios")
    } else {
      if (error === undefined) {
        this.router.navigate(['inicio']);
      } else {
        let e = JSON.stringify(error)
        if (e.includes('The email address is badly formatted'))
          alert("Debe ingresar un correo válido")
        else if (e.includes('There is no user record corresponding to this identifier. The user may have been deleted'))
          alert("Usuario no registrado")
        else if (e.includes('The password is invalid or the user does not have a password'))
          alert("Contraseña incorrecta")
      }

    }
  }

  registrarse() {
    this.router.navigate(['registro']);
  }

  loginEmpresa() {
    this.router.navigate(['login']);
  }

}
