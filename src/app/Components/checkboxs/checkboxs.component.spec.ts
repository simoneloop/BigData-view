import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxsComponent } from './checkboxs.component';

describe('CheckboxsComponent', () => {
  let component: CheckboxsComponent;
  let fixture: ComponentFixture<CheckboxsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckboxsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckboxsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
