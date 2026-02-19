import { Component, inject, OnInit, signal } from '@angular/core';
import { ProfileDisplayCard } from '../profile-display-card/profile-display-card';
import { UserService } from '../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';


@Component({
  selector: 'app-profile-gallery',
  standalone: true,
  imports: [CommonModule, ProfileDisplayCard],
  templateUrl: './profile-gallery.html',
  styleUrl: './profile-gallery.css',
})
export class ProfileGallery implements OnInit {


  public profiles = signal([] as any[]);

  userService = inject(UserService);

  authorise = inject(AuthService);

  trackByUserId = (index: number, item: any) => item.userId;

  ngOnInit() {
    this.userService.getAllProfiles().subscribe(data => {
      this.profiles.set(data);
      console.log('All Profiles from back end: ', data);
      console.log('AUTH GUARD RUNNING', this.authorise.isLoggedIn());
    });
  }


}








