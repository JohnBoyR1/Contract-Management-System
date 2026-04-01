import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Profile } from '../../core/models/profile.models';
import { ProfileStateService } from '../../core/services/profile-state.service';
import { signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ProfileSkillsModal } from '../../core/shared/components/profile-skills-modal/profile-skills-modal';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-profile-display-card',
  imports: [CommonModule, ProfileSkillsModal, MatTooltipModule],
  templateUrl: './profile-display-card.html',
  styleUrl: './profile-display-card.css',
})
export class ProfileDisplayCard {

  constructor(
    private router: Router,
    public profileState: ProfileStateService
  ) {}

  // The user profile passed in from the parent component
  @Input() user!: Profile;

  // Reactive signal for the profile image URL
  profileImageUrl = signal<string | null>(null);

  // Build the full profile image URL if one exists
  // Otherwise fall back to null (default image in template)
  ngOnInit() {
    if (this.user.profileImagePath) {
      this.profileImageUrl.set(`${environment.apiUrl}${this.user.profileImagePath}`);
    } else {
      this.profileImageUrl.set(null);
    }
  }


   // Display logic for phone number
   //If the user hides their number, show placeholder text instead
  displayPhoneNumber() {
    return this.user.hidePhoneNumber ? "User Hidden" : this.user.phoneNumber;
  }


  //Display either username or full name depending on user preference.
  displayUserNameProfile() {
    return this.user.displayUserName
      ? this.user.username
      : `${this.user.firstName} ${this.user.lastName}`;
  }

  // Returns the user's selected skills.
  // Used by the skills modal.
  displayUserSkills() {
    return this.user.selectedSkills;
  }

  //Determine the user's work status. 
  workStatus() {
    if (this.user?.availableForWork && this.user?.offeringWork) {
      return "both";        // Hiring + looking for work
    } else if (this.user?.availableForWork) {
      return "available";   // Looking for work only
    } else if (this.user?.offeringWork) {
      return "offering";    // Hiring only
    } else {
      return "none";        // Neither
    }
  }

  //Tooltip text for the profile picture ring.
  //Maps the workStatus() string to a readable label.
   
  workStatusTooltip(): string {
    const status = this.workStatus();

    switch (status) {
      case 'both':
        return 'Both Hiring and looking for work';
      case 'available':
        return 'Looking for work';
      case 'offering':
        return 'Hiring';
      default:
        return 'Status not set';
    }
  }

  
  //Opens a social link in a new tab.
  openLink(platform: string) {
    const url = this.user?.socials?.[platform];
    if (url) {
      window.open(url, '_blank');
    }
  }

 
  //Opens the chat popup using named router outlets.
  openChat() {
    console.log("Opening chat popup...");
    this.router.navigate([{ outlets: { popup: ['chat'] }}]);
  }
}