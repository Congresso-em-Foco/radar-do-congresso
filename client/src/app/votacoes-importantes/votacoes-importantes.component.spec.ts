import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VotacoesImportantesComponent } from './votacoes-importantes.component';

describe('VotacoesImportantesComponent', () => {
  let component: VotacoesImportantesComponent;
  let fixture: ComponentFixture<VotacoesImportantesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VotacoesImportantesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VotacoesImportantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
