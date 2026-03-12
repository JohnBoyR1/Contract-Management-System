import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialMediaLinks } from './social-media-links';

describe('SocialMediaLinks', () => {
  let component: SocialMediaLinks;
  let fixture: ComponentFixture<SocialMediaLinks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialMediaLinks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocialMediaLinks);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
