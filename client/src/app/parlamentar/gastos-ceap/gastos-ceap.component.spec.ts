import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GastosCeapComponent } from './gastos-ceap.component';

describe('GastosCeapComponent', () => {
  let component: GastosCeapComponent;
  let fixture: ComponentFixture<GastosCeapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GastosCeapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GastosCeapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
