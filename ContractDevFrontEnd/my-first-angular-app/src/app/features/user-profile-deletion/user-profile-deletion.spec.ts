import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileDeletion } from './user-profile-deletion';

describe('UserProfileDeletion', () => {
  let component: UserProfileDeletion;
  let fixture: ComponentFixture<UserProfileDeletion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProfileDeletion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserProfileDeletion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
