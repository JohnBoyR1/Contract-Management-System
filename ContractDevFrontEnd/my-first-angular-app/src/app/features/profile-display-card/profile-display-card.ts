import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Profile } from '../../core/models/profile.models';
import { ProfileStateService } from '../../core/services/profile-state.service';
import { signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ProfileSkillsModal } from '../../core/shared/components/profile-skills-modal/profile-skills-modal';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StarRatingModal} from '../../core/shared/components/star-rating-modal/star-rating-modal';
import { UserService } from '../../core/services/user.service';
import { WritableSignal } from '@angular/core';
import { effect } from '@angular/core';
import { SelectedProfileStateService } from '../../core/services/selected-profile-state.service';

@Component({
  selector: 'app-profile-display-card',
  imports: [CommonModule, ProfileSkillsModal, MatTooltipModule, StarRatingModal],
  templateUrl: './profile-display-card.html',
  styleUrl: './profile-display-card.css',
})
export class ProfileDisplayCard {

  constructor(
    private router: Router,
    public profileState: ProfileStateService,
    public selectedProfileState: SelectedProfileStateService,
    public userService: UserService,
  ) {
    //reacting to signal
    effect((): void => {
      const action = this.ratingAction();
      if (!action) return;

      if (action.type === 'add') {
        this.submitRating(action.payload);
      }

      if (action.type === 'remove') {
        this.removeRating(action.payload);
      }

      this.ratingAction.set(null);
    });

  }

  // The user profile passed in from the parent component
  @Input() user!: Profile;

  // Reactive signal for the profile image URL
  profileImageUrl = signal<string | null>(null);
  // rating signal
  ratingAction: WritableSignal<{ type: 'add' | 'remove', payload: any } | null> =
  signal(null);

  selectedProfile = signal<Profile | null>(null);

  // Build the full profile image URL if one exists
  // Otherwise fall back to null (default image in template)
  ngOnInit() {
    if (this.user.profileImagePath) {
      this.profileImageUrl.set(`${environment.apiUrl}${this.user.profileImagePath}`);
    } else {
      this.profileImageUrl.set(null);
    }

    this.loadExistingRating();


    /* Load existing rating for THIS profile
      this.userService.getUserRating(
        this.profileState.userId(),   // reviewer
        this.user.userId              // reviewee
      ).subscribe(rating => {
        this.user.existingRating = rating ?? null;
      });*/

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

  loadExistingRating() {
    const reviewerId = this.profileState.userId();   // logged-in user
    const revieweeId = this.user.userId;             // profile being viewed

    this.userService.getUserRating(reviewerId, revieweeId)
      .subscribe(rating => {
        this.user.existingRating = rating ?? null;
      });
  }


  
  submitRating(payload: any){
    const formData = new FormData();

    formData.append("ReviewerId", payload.profileState.userId());
    formData.append("RevieweeId", payload.user.userId);
    formData.append("TimeManagementScore", payload.time_management_score);
    formData.append("PaymentReliabilityScore", payload.payment_reliability_score);
    formData.append("CommunicationScore", payload.communication_score);
    formData.append("CollaborationScore", payload.collaboration_score);
    formData.append("RecomendationScore", payload.recommendation_score);

    // Set the selected profile for the modal
    this.selectedProfileState.setProfile(this.user);


    this.userService.addRating(formData).subscribe({
      next: () => {
        console.log("Rating saved successfully");
        // optional: close modal, refresh UI, show toast
      },
      error: (err) => {
        console.error("Rating failed", err);
      }
    });
  }

  removeRating(payload: any) {
    const formData = new FormData();

    formData.append("ReviewerId", payload.reviewerId.toString());
    formData.append("RevieweeId", payload.user_account_id.toString());

    this.userService.removeRating(formData).subscribe({
      next: () => {
        console.log("Rating removed");
        // optional: refresh UI, close modal, show toast
      },
      error: (err) => {
        console.error("Failed to remove rating", err);
      }
    });
  }

  

  //Opens the chat popup using named router outlets.
  openChat() {
    console.log("Opening chat popup...");
    this.router.navigate([{ outlets: { popup: ['chat'] }}]);
  }

  openRatingModal() {
    // 1. Set the selected profile BEFORE the modal opens
    this.selectedProfileState.setProfile(this.user);

    // 2. Load the rating for THIS profile
    const reviewerId = this.profileState.userId();   // logged-in user
    const revieweeId = this.user.userId;             // profile being viewed

    this.userService.getUserRating(reviewerId, revieweeId)
      .subscribe(rating => {
        this.user.existingRating = rating ?? null;

        // 3. Update selected profile with rating
        this.selectedProfileState.setProfile(this.user);
      });
  }

}