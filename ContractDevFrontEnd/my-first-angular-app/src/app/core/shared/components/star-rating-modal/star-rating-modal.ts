import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Profile } from '../../../models/profile.models';

@Component({
  selector: 'app-star-rating-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './star-rating-modal.html',
  styleUrls: ['./star-rating-modal.css']
})
export class StarRatingModal implements OnChanges {
  //profile being rated
  @Input() user!: Profile;
  // Id of the user giving the rating
  @Input() reviewerId!: number;
  //if the reviewer has already rated the user, load that rating?
  @Input() existingRating: any | null = null;
  //if no existing rating, fallback to the overall avarages
  @Input() ratingAverages: any | null = null;

  // This is the clean way to send data to the parent
  @Output() ratingAction = new EventEmitter<{ type: 'add' | 'remove', payload: any }>();

  // the model for all of the rating categories
  model = {
    time_management_score: 0,
    payment_reliability_score: 0,
    communication_score: 0,
    collaboration_score: 0,
    recommendation_score: 0
  };
  // hover state for UI stars highlighting
  hover = { tm: 0, pr: 0, com: 0, col: 0, rec: 0 };

  //reloads 
  ngOnChanges() {
    this.populateAgain();
  }

  // To read the averages
  getAvg(key: string): number {
    return this.ratingAverages?.[key] ?? 0;
  }

  //repopulate avoid errors or empty stars being displayed
  populateAgain() {
    if (this.existingRating) {
      this.model = { ...this.existingRating };
    } 
    else if (this.ratingAverages) {
      this.model = {
        time_management_score: Math.round(this.getAvg('Time Management')),
        payment_reliability_score: Math.round(this.getAvg('Payment Reliability')),
        communication_score: Math.round(this.getAvg('Communication')),
        collaboration_score: Math.round(this.getAvg('Collaboration')),
        recommendation_score: Math.round(this.getAvg('Recommendation'))
      };
    } 
    else {
      this.resetModel();
    }
  }


  //updates a specific score whenm a star is clicked
  setRating(field: keyof typeof this.model, value: number) {
    this.model[field] = value;
  }

  //hover state for UI star highlighting
  setHover(field: keyof typeof this.hover, value: number) {
    this.hover[field] = value;
  }

  //clears the hover highlight
  clearHover(field: keyof typeof this.hover) {
    this.hover[field] = 0;
  }
  
  //removes the rating action so profile-display-cards(parent) can delete ratings from the back end
  remove() {
    this.ratingAction.emit({
      type: 'remove',
      payload: {
        reviewerId: this.reviewerId,
        user_account_id: this.user.userId
      }
    });
    this.resetModel();
  }

  //updates the rating action so profile-display-cards(parent) can update the ratings
  submit() {
    this.ratingAction.emit({
      type: 'add',
      payload: {
        ...this.model // Sends the 5 scores
      }
    });
  }

  //resets all scores to zero and hover states
  resetModel() {
    this.model = {
      time_management_score: 0,
      payment_reliability_score: 0,
      communication_score: 0,
      collaboration_score: 0,
      recommendation_score: 0
    };
    this.hover = { tm: 0, pr: 0, com: 0, col: 0, rec: 0 };
  }
}



