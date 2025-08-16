import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorFormComponent } from './doctor-form.component';
import { Country } from '../../shared/models/country.model';

describe('DoctorFormComponent', () => {
  let component: DoctorFormComponent;
  let fixture: ComponentFixture<DoctorFormComponent>;
  

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
