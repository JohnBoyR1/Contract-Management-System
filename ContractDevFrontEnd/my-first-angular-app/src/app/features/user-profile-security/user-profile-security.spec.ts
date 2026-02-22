import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileSecurity } from './user-profile-security';

describe('UserProfileSecurity', () => {
  let component: UserProfileSecurity;
  let fixture: ComponentFixture<UserProfileSecurity>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProfileSecurity]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserProfileSecurity);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
