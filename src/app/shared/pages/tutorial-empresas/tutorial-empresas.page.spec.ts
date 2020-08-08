import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TutorialEmpresasPage } from './tutorial-empresas.page';

describe('TutorialEmpresasPage', () => {
  let component: TutorialEmpresasPage;
  let fixture: ComponentFixture<TutorialEmpresasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorialEmpresasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TutorialEmpresasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
