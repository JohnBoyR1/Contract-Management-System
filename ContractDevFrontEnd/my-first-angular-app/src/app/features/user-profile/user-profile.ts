import { Component, computed } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
//input signals
import { ProfileStateService } from '../../core/shared/profile-state.service';
import { UserService } from '../../core/services/user.service';
import { Profile } from '../../core/models/profile.models';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile {
  profileForm: FormGroup; //?

  private userService = inject(UserService);
  private authService = inject(AuthService);

  // 2. Inject the Router in the constructor
  constructor(
    private http: HttpClient,

    private router: Router,
    private fb: FormBuilder, //FormBuilder is a built in angular ?
    public profile: ProfileStateService, //then I can use {{ profile.firstName() }} etc.
  ) {
    this.profileForm = this.fb.group({
      id: [this.authService.getCurrentUserId()], // set sub()
      title: [''], //? after last update 23/02/2026
      firstName: [''],
      lastName: [''],
      jobRole: [''],
      username: [''],
      phoneNumber: [''],
      email: [''],
      country: [''],
      description: [''],
      bio: [''],
      twoFactorAuth: [''],
      availableForWork: [false],
      offeringWork: [false],
      displayUserName: [false],
      hidePhoneNumber: [false],

      
    });
  }

  ngOnInit() {
    const id = this.authService.getCurrentUserId();

    //subscribe is used to recieve data asyschronously (returns an Observable)
    this.userService.getProfile(id).subscribe((profile) => {
      this.profileForm.patchValue(profile); 

      //updating global profile state
      this.profile.initProfile(profile);

      /*Build and store the full image URL
      if (profile.profileImagePath) {
        const fullImageUrl = `${environment.apiUrl}${profile.profileImagePath}`;
        //setting the signal for global use
        this.profile.profileImageUrl.set(fullImageUrl);
      }*/
    });
  }

  /*goUploadImage() {
    this.router.navigate(["/userProfileUploadImage"]);
  }*/

  nameDisplay() {
    return `${this.profile.firstName()} ${this.profile.lastName()}`;
  }

  saveProfile() {
    const id = this.authService.getCurrentUserId();

    const raw = this.profileForm.value;

    const formData = new FormData();

    // append all text fields (underscore instead of key (We only care about the values))
    Object.entries(raw).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        formData.append(key, value as any);
      }
    });

    //append ID (as it is not part of the form)
    //formData.append('id', id.toString());

    // append file from signal (only if selected) PROFILE PICTURE
    //const profileFile = this.profile.selectedFileForProfile();

    //if (profileFile) {
    // formData.append('profilePicture', profileFile);
    //}

    /*<input type="file" (change)="onFileSelected($event)" accept="image/*">*/

    //updating the user profile  (must change to send FormData instead of JSON)
    /*const payload = Object.fromEntries(
    Object.entries(raw).filter(([_, v]) => v !== '' && v !== null)//stripping out empty values(only sending meaningfull data to the Api)
  );*/

    //updating backend and refreshing the global profile state
    this.userService.updateProfile(formData).subscribe(() => {
      this.userService.getProfile(id).subscribe((fullProfile) => {
        this.profile.initProfile(fullProfile);
      });
    });
  }
}

/*--

import { Component } from '@angular/core';
import { UploadService } from './upload.service'; // Assume you have a service

@Component({
  selector: 'app-profile',
  template: `
    <h2>Edit Profile</h2>
    
    <app-file-upload 
      label="Update Avatar" 
      (fileSelected)="handleUpload($event)">
    </app-file-upload>

    <div *ngIf="uploadProgress > 0">
      Progress: {{ uploadProgress }}%
    </div>
  `
})
export class ProfileComponent {
  uploadProgress = 0;

  constructor(private uploadService: UploadService) {}

  handleUpload(file: File) {
    this.uploadService.uploadImage(file).subscribe(event => {
      // You can handle progress or success here
      console.log('File received in parent, ready for API!', file.name);
    });
  }
}*/

/*
const maxSize = 2 * 1024 * 1024; // 2MB
if (file.size > maxSize) {
  alert('File is too big!');
  return;
}

*/
