
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLinkActive, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { UserService } from '../../core/services/user.service';
import { ProfileStateService } from '../../core/services/profile-state.service';
import { signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUpload } from '../../core/shared/components/file-upload/file-upload';

@Component({
  selector: 'app-user-profile-upload-image',
  imports: [RouterLink, RouterLinkActive, FileUpload],
  templateUrl: './user-profile-upload-image.html',
  styleUrl: './user-profile-upload-image.css',
})
export class UserProfileUploadImage {
  imageUpload: FormGroup;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);
  public profile = inject(ProfileStateService);

  //signals
  deleteClicked = signal(false);

  constructor() {
    
  }

  ngOnInit() {}

  nameDisplay() {
    return `${this.profile.firstName()} ${this.profile.lastName()}`;
  }

  saveSecurity() {
    if (this.imageUpload.invalid) return;

    const raw = this.imageUpload.value;

    const formData = new FormData();

    if (raw.newPassword !== raw.confirmNewPassword) {
      alert('New passwords do not match.');
      return;
    }
    //payload to change password
    const payload = {
      Id: this.authService.getCurrentUserId(),
      currentPassword: raw.currentPassword,
      newPassword: raw.newPassword,
      securityQuestion: raw.securityQuestion,
      securityAnswer: raw.securityAnswer,
    };

    //appending payload to a formData
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        formData.append(key, value as any);
      }
    });

    
  }

}
