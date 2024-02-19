import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaCapturaComponent } from './vista-captura.component';

describe('VistaCapturaComponent', () => {
  let component: VistaCapturaComponent;
  let fixture: ComponentFixture<VistaCapturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VistaCapturaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VistaCapturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
