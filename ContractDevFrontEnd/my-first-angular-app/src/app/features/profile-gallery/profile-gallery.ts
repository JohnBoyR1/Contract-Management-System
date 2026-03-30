import { Component, inject, OnInit, signal } from '@angular/core';
import { ProfileDisplayCard } from '../profile-display-card/profile-display-card';
import { UserService } from '../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';
import { Profile } from '../../core/models/profile.models';
import { computed } from '@angular/core';
import { UiStateService } from '../../core/services/ui-state.service';

@Component({
  selector: 'app-profile-gallery',
  standalone: true,
  imports: [CommonModule, ProfileDisplayCard],
  templateUrl: './profile-gallery.html',
  styleUrl: './profile-gallery.css',
})
export class ProfileGallery implements OnInit {
  uiService = inject(UiStateService);

  public profiles = signal<Profile[]>([]);

  userService = inject(UserService);

  authorise = inject(AuthService);

  router = inject(Router);

  

 
  //search filter in the nav menu
  // Create a computed signal that filters automatically
  public filteredProfiles = computed(() => {
  const term = this.uiService.searchTerm().toLowerCase().trim();
  const allProfiles = this.profiles();

  if (!term) return allProfiles;

  return allProfiles.filter(profile => {
    // Skill match
    const skillsMatch =
      profile.skills?.some(skill =>
        skill.toLowerCase().includes(term)
      );

    // Convert booleans into searchable text
    const availableText = profile.availableForWork
      ? 'available for work open to work looking seeking  '
      : '';

    const offeringText = profile.offeringWork
      ? 'offering work hiring recruiting for developers'
      : '';

    const availableMatch = availableText.toLowerCase().includes(term);
    const offeringMatch = offeringText.toLowerCase().includes(term);

    return skillsMatch || availableMatch || offeringMatch;
  });
});


  

 
  
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








