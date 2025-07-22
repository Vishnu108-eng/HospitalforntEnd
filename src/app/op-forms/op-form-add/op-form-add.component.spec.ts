import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpFormAddComponent } from './op-form-add.component';

describe('OpFormAddComponent', () => {
  let component: OpFormAddComponent;
  let fixture: ComponentFixture<OpFormAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpFormAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpFormAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
