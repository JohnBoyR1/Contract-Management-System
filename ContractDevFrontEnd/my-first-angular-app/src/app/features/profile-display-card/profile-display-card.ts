import { Component, Input, OnInit, WritableSignal, signal, effect } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Profile } from '../../core/models/profile.models';
import { ProfileStateService } from '../../core/services/profile-state.service';
import { environment } from '../../../environments/environment';
import { ProfileSkillsModal } from '../../core/shared/components/profile-skills-modal/profile-skills-modal';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StarRatingModal } from '../../core/shared/components/star-rating-modal/star-rating-modal';
import { UserService } from '../../core/services/user.service';
import { SelectedProfileStateService } from '../../core/services/selected-profile-state.service';


@Component({
  selector: 'app-profile-display-card',
  standalone: true,
  imports: [CommonModule, ProfileSkillsModal, MatTooltipModule, StarRatingModal],
  templateUrl: './profile-display-card.html',
  styleUrl: './profile-display-card.css',
})
export class ProfileDisplayCard implements OnInit {
  // Input received from the parent Gallery component representing a single user
  @Input() user!: Profile;

  // Signal to store the computed full URL for the user's profile image
  profileImageUrl = signal<string | null>(null);

  // Signal to capture rating actions (add/remove) emitted from the rating modal
  ratingAction: WritableSignal<{ type: 'add' | 'remove', payload: any } | null> = signal(null);


  constructor(
    private router: Router,
    public profileState: ProfileStateService, // Global state for the logged-in user
    public selectedProfileState: SelectedProfileStateService, // Shared state for the user currently in a modal
    public userService: UserService // API service for database operations
  ) {
    /**
      REACTIVE EFFECT: Handles the submission logic when ratingAction changes.
      Since every card in a gallery listens to this signal, the ID check is CRITICAL.
     */
    effect(() => {
      const action = this.ratingAction();
      if (!action) return;

      // Identify which user is actually targeted in the modal right now
      const selectedId = this.selectedProfileState.selectedProfile()?.userId;

      // GUARD: Only the specific card instance matching the target user handles the API call.
      // This prevents "Gallery Crossfire" where every card tries to submit the same rating.
      if (this.user.userId !== selectedId) {
        return; 
      }

      // Execute the appropriate API logic based on the action type
      if (action.type === 'add') {
        this.submitRating(action.payload);
      } else if (action.type === 'remove') {
        this.removeRating();
      }

      // Reset signal to null so the same action can be triggered again later if needed
      this.ratingAction.set(null); 
    });
  }

  ngOnInit() {
    // Construct the full image URL by prefixing the relative path with the API base URL
    if (this.user.profileImagePath) {
      this.profileImageUrl.set(`${environment.apiUrl}${this.user.profileImagePath}`);
    } else {
      this.profileImageUrl.set(null);
    }
  }

  
   //Triggers the rating modal by setting the 'selectedProfile' in the global state.
 
  openRatingModal(user: Profile) {
    const myId = this.profileState.userId();
    const targetId = user.userId;

    // UI-level guard to prevent users from rating their own profiles
    if (myId === targetId) {
      alert("You cannot rate yourself!");
      return;
    }

    // Updating this shared signal allows the modal (wherever it lives) to display this user's data
    this.selectedProfileState.setProfile({ ...user});
  }

  /*
    Prepares and sends rating data to the backend using FormData.
    Logic is mapped to match the UserRatingDto.cs structure.
   */
  submitRating(payload: any) {
    const loggedInId = this.profileState.userId(); // Current logged-in user (Reviewer)
    const cardUserId = this.user.userId;           // This card's user (Reviewee)

    // Final safety check to ensure IDs are not identical before making the network request
    if (loggedInId === cardUserId) return;

    const formData = new FormData();
    // Identifiers for the relationship
    formData.append("ReviewerId", String(loggedInId));
    formData.append("RevieweeId", String(cardUserId));
    
    // Individual scores (Payload keys match the modal's internal model)
    // Note: 'RecomendationScore' matches the spelling in the backend DTO
    formData.append("TimeManagementScore", String(payload.time_management_score));
    formData.append("PaymentReliabilityScore", String(payload.payment_reliability_score));
    formData.append("CommunicationScore", String(payload.communication_score));
    formData.append("CollaborationScore", String(payload.collaboration_score));
    formData.append("RecommendationScore", String(payload.recommendation_score));

    // Execute the POST request to AddRating
    this.userService.addRating(formData).subscribe({
      next: () => {
        alert("Rating submitted successfully!");
      },
      error: (err) => console.error("Submission failed:", err)
    });
  }


   // Prepares and sends a deletion request to remove a specific rating.
  removeRating() {
    const formData = new FormData();
    // Reviewer and Reviewee pair uniquely identifies the rating record
    formData.append("ReviewerId", this.profileState.userId().toString());
    formData.append("RevieweeId", this.user.userId.toString());

    this.userService.removeRating(formData).subscribe({
      next: () => alert("Rating removed successfully"),
      error: (err) => console.error("Rating removal failed", err)
    });
  }


  /*Mask phone number if user preference 'hidePhoneNumber' is enabled */
  displayPhoneNumber() { return this.user.hidePhoneNumber ? "User Hidden" : this.user.phoneNumber; }
  
  /*Toggle between showing the Username or First + Last name based on user preference */
  displayUserNameProfile() { 
    return this.user.displayUserName ? this.user.username : `${this.user.firstName} ${this.user.lastName}`; 
  }

  /*Logical check for the user's current employment/hiring status */
  workStatus() {
    if (this.user?.availableForWork && this.user?.offeringWork) return "both";
    return this.user?.availableForWork ? "available" : (this.user?.offeringWork ? "offering" : "none");
  }

  /*Returns human-readable strings for the CSS/Mat-Tooltip indicating work status */
  workStatusTooltip(): string {
    const status = this.workStatus();
    switch (status) {
      case 'both': return 'Both Hiring and looking for work';
      case 'available': return 'Looking for work';
      case 'offering': return 'Hiring';
      default: return 'Status not set';
    }
  }

  /*Opens social media links in a new browser tab safely */
  openLink(platform: string) {
    const url = this.user?.socials?.[platform];
    if (url) window.open(url, '_blank');
  }

  /*Navigates to the chat outlet */
  openChat() { this.router.navigate([{ outlets: { popup: ['chat'] }}]); }
}

