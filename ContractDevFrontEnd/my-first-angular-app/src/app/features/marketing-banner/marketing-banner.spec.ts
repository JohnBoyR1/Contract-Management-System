import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingBanner } from './marketing-banner';

describe('MarketingBanner', () => {
  let component: MarketingBanner;
  let fixture: ComponentFixture<MarketingBanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketingBanner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketingBanner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
