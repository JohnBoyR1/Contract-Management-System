import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntroBanner } from './intro-banner';

describe('IntroBanner', () => {
  let component: IntroBanner;
  let fixture: ComponentFixture<IntroBanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntroBanner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntroBanner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
