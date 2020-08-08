import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  nombres: string;
  apellidos: string;
  correo: string;
  contrasena: string;

  constructor(private auth: AuthService,
    private router: Router) { }

  ngOnInit() {
  }

  async registro() {
    let error = await this.auth.signupUser(this.nombres + " " + this.apellidos,
      this.correo, this.contrasena)

    if (this.nombres == undefined || this.apellidos == undefined || this.correo == undefined || this.contrasena == undefined) {
      alert("Todos los campos son obligatorios")
    } else {
      if (error === undefined) {
        this.auth.emailPasswordLogin(this.correo, this.contrasena, 'user').then(res => {
          this.router.navigate(['direccion']);
        })
      } else {
        let e = JSON.stringify(error)
        if (e.includes('The email address is badly formatted'))
          alert("Debe ingresar un correo válido")
        if (e.includes('Password should be at least 6 characters'))
          alert("La contraseña debe tener por lo menos 6 caracteres")
      }
    }

  }

}
