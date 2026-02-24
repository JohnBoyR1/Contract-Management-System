import { Component, Input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Profile } from '../../core/models/profile.models';
import { ProfileStateService } from '../../core/shared/profile-state.service';



@Component({
  selector: 'app-profile-display-card',
  imports: [CommonModule],
  templateUrl: './profile-display-card.html',
  styleUrl: './profile-display-card.css',
})
export class ProfileDisplayCard {
  

  constructor(
    private router: Router,
    public profile: ProfileStateService
  ){}
  @Input() user: Profile;
  
  displayPhoneNumber(){
    return this.user.hidePhoneNumber ? "User Hidden" : this.user.phoneNumber;
  }

  displayUserNameProfile(){
    return this.user.displayUserName ? this.user.username : `${this.user.firstName} ${this.user.lastName}`;
  }

  workStatus(){
    if(this.user.availableForWork && this.user.offeringWork){
      return "both";
    }else if (this.user.availableForWork){
      return "available";
    }else if (this.user.offeringWork) {
      return "offering";
    } else if(this.user.availableForWork && this.user.offeringWork){
      return "none";
    }
  }

  openChat() {
    console.log("Button clicked! Attempting to open popup...");
    this.router.navigate(
      [{ outlets: { popup: ['chat'] }}]
    );   
  }

}
