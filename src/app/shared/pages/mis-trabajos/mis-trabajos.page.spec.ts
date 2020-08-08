import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MisTrabajosPage } from './mis-trabajos.page';

describe('MisTrabajosPage', () => {
  let component: MisTrabajosPage;
  let fixture: ComponentFixture<MisTrabajosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisTrabajosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MisTrabajosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
