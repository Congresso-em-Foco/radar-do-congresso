import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EleicaoComponent } from './eleicao.component';

describe('EleicaoComponent', () => {
  let component: EleicaoComponent;
  let fixture: ComponentFixture<EleicaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EleicaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EleicaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
