import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscursosComponent } from './discursos.component';

describe('DiscursosComponent', () => {
  let component: DiscursosComponent;
  let fixture: ComponentFixture<DiscursosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscursosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscursosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
