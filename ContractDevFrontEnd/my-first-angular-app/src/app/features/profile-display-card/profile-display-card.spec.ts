import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileDisplayCard } from './profile-display-card';

describe('ProfileDisplayCard', () => {
  let component: ProfileDisplayCard;
  let fixture: ComponentFixture<ProfileDisplayCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileDisplayCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileDisplayCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
