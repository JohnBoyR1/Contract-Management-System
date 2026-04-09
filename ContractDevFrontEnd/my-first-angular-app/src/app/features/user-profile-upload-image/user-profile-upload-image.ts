import { Component, inject } from '@angular/core';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { ProfileStateService } from '../../core/services/profile-state.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FileUpload } from '../../core/shared/components/file-upload/file-upload';

@Component({
  selector: 'app-user-profile-upload-image',
  imports: [RouterLink, RouterLinkActive, FileUpload, MatTooltipModule],
  templateUrl: './user-profile-upload-image.html',
  styleUrl: './user-profile-upload-image.css',
})
export class UserProfileUploadImage {
  //dependency injection
  public profile = inject(ProfileStateService);

  // Returns the user's full name.
  // Uses ProfileStateService signals for first + last name.
  nameDisplay() {
    return `${this.profile.firstName()} ${this.profile.lastName()}`;
  }

  
}