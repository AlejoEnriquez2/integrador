import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  correo: string;
  contrasena: string;

  constructor(private auth: AuthService, 
    private router: Router) { }

  ngOnInit() {
  }

  async login() {
    let error = await this.auth.emailPasswordLogin(this.correo, this.contrasena, 'employee');
    if (error === undefined) {
      this.router.navigate(['inicio-e']);
    } else {
      alert(JSON.stringify(error));
    }
  }

}
