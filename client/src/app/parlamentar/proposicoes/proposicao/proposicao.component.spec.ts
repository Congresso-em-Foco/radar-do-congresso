import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposicaoComponent } from './proposicao.component';

describe('ProposicaoComponent', () => {
  let component: ProposicaoComponent;
  let fixture: ComponentFixture<ProposicaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProposicaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposicaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
