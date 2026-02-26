import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileUploadImage } from './user-profile-upload-image';

describe('UserProfileUploadImage', () => {
  let component: UserProfileUploadImage;
  let fixture: ComponentFixture<UserProfileUploadImage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProfileUploadImage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserProfileUploadImage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
