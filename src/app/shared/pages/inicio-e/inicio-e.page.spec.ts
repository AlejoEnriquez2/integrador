import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InicioEPage } from './inicio-e.page';

describe('InicioEPage', () => {
  let component: InicioEPage;
  let fixture: ComponentFixture<InicioEPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InicioEPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InicioEPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
