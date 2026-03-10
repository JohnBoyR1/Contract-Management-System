import { Component, computed } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ProfileStateService } from '../../core/shared/profile-state.service';
//importing signals


@Component({
  selector: 'app-profile-card',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './profile-card.html',
  styleUrl: './profile-card.css',
})
export class ProfileCard {

  constructor(
    public profile: ProfileStateService,
    private router: Router,
  ){}

  
  
  //put firstName and lastName together
  fullName = computed(() => `${this.profile.firstName()} ${this.profile.lastName()}`);
  

  //what colour will be displayed wether working/offering work or both
  workStatus() {
    if (this.profile.offeringWork() && this.profile.availableForWork()){
      return "both";
    }else if (this.profile.offeringWork()){
      return "offering";
    }else if (this.profile.availableForWork()){
      return "available";
    }else if (!this.profile.offeringWork() && !this.profile.availableForWork()){
      return "none";
    }
  }

  ngOnInit() {
    console.log("ProfileCard image:", this.profile.profileImageUrl());
  }
  
  //display phone number
  isPhoneDisplay(){
    if(this.profile.hidePhoneNumber()){
      return 'User Hidden';  
    }else{
      return this.profile.phoneNumber();
    }
  }

  // display name 
  isdisplayUserName() {
    //inline if statement
    return this.profile.displayUserName() ? this.profile.username() : this.fullName();
    
  }
  
  // display bio
  displayBio() {
    return this.profile.bio();
  }

  // display email
  displayEmail() {
    return this.profile.email();
  }

  //a click handler
  openLink(url: string) {
    if (!url) return;
    window.open(url, '_blank');
  }


  openChat() {
    console.log("Button clicked! Attempting to open popup...");
    console.log(this.profile);
    console.log(this.profile.facebookLink);
    console.log(this.profile.facebookLink());
    console.log(JSON.stringify(this.profile.facebookLink()));
    this.router.navigate(
      [{ outlets: { popup: ['chat'] }}]
    );   
  }
}

