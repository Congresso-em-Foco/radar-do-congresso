import { TestBed } from '@angular/core/testing';

import { ProposicaoService } from './proposicao.service';

describe('ProposicaoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProposicaoService = TestBed.get(ProposicaoService);
    expect(service).toBeTruthy();
  });
});
