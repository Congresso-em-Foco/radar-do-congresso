import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleheaderComponent } from './titleheader.component';

describe('TitleheaderComponent', () => {
  let component: TitleheaderComponent;
  let fixture: ComponentFixture<TitleheaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TitleheaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TitleheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
