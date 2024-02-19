import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaListadoComponent } from './vista-listado.component';

describe('VistaListadoComponent', () => {
  let component: VistaListadoComponent;
  let fixture: ComponentFixture<VistaListadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VistaListadoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VistaListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
