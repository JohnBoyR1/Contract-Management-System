import { Component, inject, OnInit, signal } from '@angular/core';
import { ProfileDisplayCard } from '../profile-display-card/profile-display-card';
import { UserService } from '../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';
import { Profile } from '../../core/models/profile.models';

@Component({
  selector: 'app-profile-gallery',
  standalone: true,
  imports: [CommonModule, ProfileDisplayCard],
  templateUrl: './profile-gallery.html',
  styleUrl: './profile-gallery.css',
})
export class ProfileGallery implements OnInit {


  //public profiles = signal([] as any[]);

  public profiles = signal<Profile[]>([]);

  userService = inject(UserService);

  authorise = inject(AuthService);

  router = inject(Router);

  
  ngOnInit() {
    //this is to ensure (non-logged in users) using url commands are directed to the home page
      if (!this.authorise.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }
    this.userService.getAllProfiles().subscribe(data => {
      this.profiles.set(data);
      console.log('All Profiles from back end: ', data);
      console.log('AUTH GUARD RUNNING', this.authorise.isLoggedIn());
    });
  }


}








