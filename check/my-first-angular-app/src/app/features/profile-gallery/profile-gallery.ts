import { Component } from '@angular/core';
import { ProfileDisplayCard } from '../profile-display-card/profile-display-card';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-profile-gallery',
  standalone: true,
  imports: [ProfileDisplayCard],
  templateUrl: './profile-gallery.html',
  styleUrl: './profile-gallery.css',
})
export class ProfileGallery {
  profiles: any[] = [];//need for multi
 

  constructor(private userService: UserService) {}

  //for when the page loads
  ngOnInit(): void {
    this.userService.getAllProfiles().subscribe({//and this
      next: (data) => {
        console.log("ALL PROFILES FROM BACKEND:", data);
        this.profiles = data;
      },
      error: (err) => console.error('Error loading profiles', err)
    });
  }
  
}
