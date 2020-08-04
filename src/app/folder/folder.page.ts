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

  ngOnInit() {}

  async login() {
    let error = await this.auth.emailPasswordLogin(this.correo, this.contrasena);
    if (error === undefined) {
      this.router.navigate(['inicio']);
    } else {
      alert(JSON.stringify(error));
    }
  }

  registrarse() {
    this.router.navigate(['registro']);
  }

}
