import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Observable } from 'rxjs';
import { AuthService } from './shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Inicio',
      url: 'inicio',
      icon: 'mail'
    },
    {
      title: 'Mi Perfil',
      url: '/folder/Outbox',
      icon: 'person'
    }
  ];
  public labels = ['About'];

  user: Observable<any>;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private auth: AuthService,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.auth.getCurrentUser().then(user => {
        this.user = this.auth.user;
        if (user) {
          if (user.rol == 'user') {
            this.router.navigate(['inicio']);
          } else {
            this.router.navigate(['inicio-e']);
          }
        } else {
          this.router.navigate(['folder/Inbox']);
        }
      })

    });
  }

  ngOnInit() {
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }

  async logout() {
    await this.auth.logout();
    this.router.navigate(['folder/Inbox']);
  }

  async respuestas() {
    this.selectedIndex = 100
    this.router.navigate(['respuestas']);
  }

  async solicitudes() {
    this.selectedIndex = 100
    this.router.navigate(['solicitudes']);
  }

  async trabajos() {
    this.selectedIndex = 101
    this.router.navigate(['trabajos']);
  }
}
