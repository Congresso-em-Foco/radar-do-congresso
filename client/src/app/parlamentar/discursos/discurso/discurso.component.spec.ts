import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscursoComponent } from './discurso.component';

describe('DiscursoComponent', () => {
  let component: DiscursoComponent;
  let fixture: ComponentFixture<DiscursoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscursoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
