import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DireccionPage } from './direccion.page';

describe('DireccionPage', () => {
  let component: DireccionPage;
  let fixture: ComponentFixture<DireccionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DireccionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DireccionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
