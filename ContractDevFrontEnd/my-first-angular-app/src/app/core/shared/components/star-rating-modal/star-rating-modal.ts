import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Profile } from '../../../models/profile.models';

@Component({
  selector: 'app-star-rating-modal', // Ensure this matches your template tag
  standalone: true,
  imports: [CommonModule],
  templateUrl: './star-rating-modal.html',
  styleUrls: ['./star-rating-modal.css']
})
export class StarRatingModal implements OnChanges {
  @Input() user!: Profile;
  @Input() reviewerId!: number;
  @Input() existingRating: any | null = null;

  // This is the clean way to send data to the parent
  @Output() ratingAction = new EventEmitter<{ type: 'add' | 'remove', payload: any }>();

  model = {
    time_management_score: 0,
    payment_reliability_score: 0,
    communication_score: 0,
    collaboration_score: 0,
    recommendation_score: 0
  };

  hover = { tm: 0, pr: 0, com: 0, col: 0, rec: 0 };

  ngOnChanges() {
    if (this.existingRating) {
      this.model = { ...this.existingRating };
    } else {
      this.resetModel();
    }
  }

  setRating(field: keyof typeof this.model, value: number) {
    this.model[field] = value;
  }

  setHover(field: keyof typeof this.hover, value: number) {
    this.hover[field] = value;
  }

  clearHover(field: keyof typeof this.hover) {
    this.hover[field] = 0;
  }

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

  submit() {
    this.ratingAction.emit({
      type: 'add',
      payload: {
        ...this.model // Sends the 5 scores
      }
    });
    this.resetModel();
  }

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



/*
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Profile } from '../../../models/profile.models';
import { Signal } from '@angular/core';

@Component({
  selector: 'app-rating-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './star-rating-modal.html',
  styleUrls: ['./star-rating-modal.css']
})
export class StarRatingModal {
  //view individual users
  @Input() user!: Profile;

  @Input() reviewerId!: number;

  @Input() ratingAction!: Signal<any>;

  @Input() setRatingAction!: (value: any)=> void;
 
  @Output() save = new EventEmitter<any>();

  model = {
    time_management_score: 0,
    payment_reliability_score: 0,
    communication_score: 0,
    collaboration_score: 0,
    recommendation_score: 0
  };

  hover = {
    tm: 0,
    pr: 0,
    com: 0,
    col: 0,
    rec: 0
  };

  setRating(field: keyof typeof this.model, value: number) {
    this.model[field] = value;
  }

  setHover(field: keyof typeof this.hover, value: number) {
    this.hover[field] = value;
  }

  clearHover(field: keyof typeof this.hover) {
    this.hover[field] = 0;
  }

  remove() {
    this.setRatingAction({
      type: 'remove',
      payload: {
        reviewer_id: this.reviewerId,
        user_account_id: this.user.userId
      }
    });
    this.resetModel();
  }

  submit() {
    this.setRatingAction({
      type: 'add',
      payload: {
        reviewer_id: this.reviewerId,
        user_account_id: this.user.userId,
        ...this.model
      }
    });
    this.resetModel();
  }

  //resetting after submit or remove
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

  /*auto close after rating
  closeModal() {
    const modal = document.getElementById('ratingModal');
    if (modal) {
      const instance = bootstrap.Modal.getInstance(modal) 
        || new bootstrap.Modal(modal);
      instance.hide();
    }
  }*

  @Input() existingRating: any | null = null;

  ngOnChanges() {
    if (this.existingRating) {
      this.model = { ...this.existingRating };
    }
  }



}*/