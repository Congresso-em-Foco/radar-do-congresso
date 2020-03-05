import { TestBed } from '@angular/core/testing';

import { AssiduidadeService } from './assiduidade.service';

describe('AssiduidadeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AssiduidadeService = TestBed.get(AssiduidadeService);
    expect(service).toBeTruthy();
  });
});
