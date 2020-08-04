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
    if (error === undefined) {
      this.auth.emailPasswordLogin(this.correo, this.contrasena).then(res => {
        this.router.navigate(['direccion']);
      })
    } else {
      alert(JSON.stringify(error))
    }
    //this.router.navigate(['direccion']);
  }

}
