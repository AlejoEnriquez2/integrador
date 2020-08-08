import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tutorial-empresas',
  templateUrl: './tutorial-empresas.page.html',
  styleUrls: ['./tutorial-empresas.page.scss'],
})
export class TutorialEmpresasPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  continuar() {
    this.router.navigate(['inicio-e']);
  }

}
