import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssiduidadeComponent } from './assiduidade.component';

describe('AssiduidadeComponent', () => {
  let component: AssiduidadeComponent;
  let fixture: ComponentFixture<AssiduidadeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssiduidadeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssiduidadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
