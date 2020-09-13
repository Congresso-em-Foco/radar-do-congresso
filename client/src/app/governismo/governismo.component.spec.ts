import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GovernismoComponent } from './governismo.component';

describe('GovernismoComponent', () => {
  let component: GovernismoComponent;
  let fixture: ComponentFixture<GovernismoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GovernismoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GovernismoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
