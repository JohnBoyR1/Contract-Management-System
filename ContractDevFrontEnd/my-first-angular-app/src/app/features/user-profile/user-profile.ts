import { Component, computed } from '@angular/core';
import {Router, RouterLink, RouterLinkActive } from "@angular/router";
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
//input signals 
import { ProfileStateService } from '../../core/shared/profile-state.service';
import { UserService } from '../../core/services/user.service';
import { Profile } from '../../core/models/profile.models';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';





@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile {
  profileForm: FormGroup;//?
  


  private userService = inject(UserService);
  private authService = inject(AuthService);

  // 2. Inject the Router in the constructor
  constructor(
    private http: HttpClient, 

    private router: Router,
    private fb: FormBuilder, //FormBuilder is a built in angular ?
    public profile: ProfileStateService //then I can use {{ profile.firstName() }} etc.
  ) {
    this.profileForm = this.fb.group({
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
      hidePhoneNumber: [false]

    });
  }

  ngOnInit() {
      
      const id = this.authService.getCurrentUserId();
      //subscribe is used to recieve data asyschronously (returns an Observable)
      this.userService.getProfile(id).subscribe(profile => {
      this.profileForm.patchValue(profile);//this is what is displaying the data
      //console.log("User ID:", id);

    });
  }

  nameDisplay(){
    return `${this.profile.firstName()} ${this.profile.lastName()}`; 
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.profile.selectedFileForProfile.set(file);
  }



  saveProfile() {
    const id = this.authService.getCurrentUserId();

    const raw = this.profileForm.value;

    const formData = new FormData();

    


    // append all text fields (underscore instead of key (We only care about the values))
    Object.entries(raw).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        formData.append(key , value as any);
      }
    });

    //append ID (as it is not part of the form)
    formData.append('id', id.toString());

    // append file from signal (only if selected)
    const profileFile = this.profile.selectedFileForProfile();

    if (profileFile) {
      formData.append('profilePicture', profileFile);
    }

    /*<input type="file" (change)="onFileSelected($event)" accept="image/*">*/


    //updating the user profile  (must change to send FormData instead of JSON)
    /*const payload = Object.fromEntries(
    Object.entries(raw).filter(([_, v]) => v !== '' && v !== null)//stripping out empty values(only sending meaningfull data to the Api)
  );*/

    

    //updating backend and refreshing the global profile state
    this.userService.updateProfile(id, formData).subscribe(() => {
      this.userService.getProfile(id).subscribe(fullProfile => {
        this.profile.initProfile(fullProfile);
      });
    });

  } 
  
}
