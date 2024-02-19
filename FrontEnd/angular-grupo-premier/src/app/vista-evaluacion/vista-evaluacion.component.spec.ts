import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaEvaluacionComponent } from './vista-evaluacion.component';

describe('VistaEvaluacionComponent', () => {
  let component: VistaEvaluacionComponent;
  let fixture: ComponentFixture<VistaEvaluacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VistaEvaluacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VistaEvaluacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
