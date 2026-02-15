import { Component, computed } from '@angular/core';
import {Router, RouterLink, RouterLinkActive } from "@angular/router";
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
//input signals 
import { ProfileStateService } from '../../core/shared/profile-state.service';
import { UserService } from '../../core/services/user.service';
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
   private apiUrl = 'http://localhost:5082/api/users';


  private userService = inject(UserService);
  private authService = inject(AuthService);

  // 2. Inject the Router in the constructor
  constructor(
    private http: HttpClient, 

    private router: Router,
    private fb: FormBuilder,
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
      
      this.userService.getProfile(id).subscribe(profile => {
      this.profileForm.patchValue(profile);//this is what is displaying the data
      //console.log("User ID:", id);

    });
  }

  nameDisplay(){
    return `${this.profile.firstName()} ${this.profile.lastName()}`; 
  }

  saveProfile() {
    const id = this.authService.getCurrentUserId();

    const raw = this.profileForm.value;

    const payload = Object.fromEntries(
    Object.entries(raw).filter(([_, v]) => v !== '' && v !== null)
  );

  this.userService.updateProfile(id, payload).subscribe(() => {
    this.userService.getProfile(id).subscribe(fullProfile => {
      this.profile.initProfile(fullProfile);
    });
  });

  } 
  
}
