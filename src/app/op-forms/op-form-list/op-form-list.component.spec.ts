import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpFormListComponent } from './op-form-list.component';

describe('OpFormListComponent', () => {
  let component: OpFormListComponent;
  let fixture: ComponentFixture<OpFormListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpFormListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpFormListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
