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
      title: 'Mi Perfil',
      url: 'perfil',
      icon: 'person'
    }
  ];
  public labels = ['About'];

  user: Observable<any>;
  id: string

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
        console.log("Usuario?: ", user);
        this.user = this.auth.user;
        if (user) {
          this.id = user.uid
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
    localStorage.clear();
    this.router.navigate(['folder/Inbox']);
  }

  perfil(id) {
    this.selectedIndex = 103
    this.router.navigate([`perfil/${id}`])
  }
}
