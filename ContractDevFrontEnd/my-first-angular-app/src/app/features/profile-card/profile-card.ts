import { Component, computed } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ProfileStateService } from '../../core/services/profile-state.service';
import { ProfileSkillsModal } from '../../core/shared/components/profile-skills-modal/profile-skills-modal';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-profile-card',
  imports: [RouterLink, RouterLinkActive, ProfileSkillsModal, MatTooltipModule],
  templateUrl: './profile-card.html',
  styleUrl: './profile-card.css',
})
export class ProfileCard {

  constructor(
    public profile: ProfileStateService,
    private router: Router,
  ) {}

  // Combine first + last name into a single computed signal
  fullName = computed(() => `${this.profile.firstName()} ${this.profile.lastName()}`);

  
  //Determines the user's work status.
  workStatus() {
    if (this.profile.offeringWork() && this.profile.availableForWork()) {
      return "both";          // Hiring + looking for work
    } else if (this.profile.offeringWork()) {
      return "offering";      // Hiring only
    } else if (this.profile.availableForWork()) {
      return "available";     // Looking for work only
    } else {
      return "none";          // Neither
    }
  }

  /*
    Tooltip text for the profile picture.
    Maps the workStatus() string to a readable label.
   */
  workStatusTooltip(): string {
    const status = this.workStatus();

    switch (status) {
      case 'both':
        return 'Both hiring and looking for work';
      case 'available':
        return 'Looking for work';
      case 'offering':
        return 'Hiring';
      default:
        return 'Status not set';
    }
  }

  // Returns the full profile object.
  getProfile() {
    return this.profile.profile();
  }

  
  //Phone number display logic.
  //If user hides phone number show placeholder text instead 
  isPhoneDisplay() {
    return this.profile.hidePhoneNumber()
      ? 'User Hidden'
      : this.profile.phoneNumber();
  }

  
  //Display either username or full name depending on user preference.
  isdisplayUserName() {
    return this.profile.displayUserName()
      ? this.profile.username()
      : this.fullName();
  }

  // Bio text
  displayBio() {
    return this.profile.bio();
  }

  // Email text
  displayEmail() {
    return this.profile.email();
  }

  
  // Opens an external social link in a new tab.
  // Accepts a URL string from the template.
  openLink(url: string) {
    if (!url) return;
    console.log(url + " _blank");
    window.open(url, '_blank');
  }

  /*
    Opens the chat popup outlet.
   Uses Angular's named router outlets.
  */
  openChat() {
    console.log("Opening chat popup...");
    this.router.navigate([{ outlets: { popup: ['chat'] }}]);
  }
}
