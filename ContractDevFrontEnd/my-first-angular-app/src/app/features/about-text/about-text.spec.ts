import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutText } from './about-text';

describe('AboutText', () => {
  let component: AboutText;
  let fixture: ComponentFixture<AboutText>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutText]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutText);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
