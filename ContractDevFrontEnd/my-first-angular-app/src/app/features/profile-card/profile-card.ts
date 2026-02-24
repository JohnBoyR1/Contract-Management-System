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

  

  //service signals to computed signals(safety as computed signals are read only)
  //computed() is "lazy". It only recalculates if the signal inside it changes.
  availableForWorkOn = computed(() => this.profile.availableForWork());
  offeringWorkOn = computed(() => this.profile.offeringWork());
  displayUserName = computed(() => this.profile.displayUserName());
  hidePhoneNumber= computed(() => this.profile.hidePhoneNumber());
  phoneNumber = computed(() => this.profile.phoneNumber());
  firstName = computed(() => this.profile.firstName());
  lastName = computed(() => this.profile.lastName());
  userName = computed(() => this.profile.username());
  bio = computed(() => this.profile.bio());
  email = computed(() => this.profile.email());
  //put firstName and lastName together
  fullName = computed(() => `${this.firstName()} ${this.lastName()}`);
  

  //what colour will be displayed wether working/offering work or both
  workStatus() {
    if (this.offeringWorkOn() && this.availableForWorkOn()){
      return "both";
    }else if (this.offeringWorkOn()){
      return "offering";
    }else if (this.availableForWorkOn()){
      return "available";
    }else if (!this.offeringWorkOn() && !this.availableForWorkOn()){
      return "none";
    }
  }

  ngOnInit() {
    console.log("ProfileCard image:", this.profile.profileImageUrl());
  }
  
  //display phone number
  isPhoneDisplay(){
    if(this.hidePhoneNumber()){
      return 'User Hidden';  
    }else{
      return this.phoneNumber();
    }
  }

  // display name 
  isdisplayUserName() {
    //inline if statement
    return this.displayUserName() ? this.userName() : this.fullName();
    
  }
  
  // display bio
  displayBio() {
    return this.bio();
  }

  // display email
  displayEmail() {
    return this.email();
  }

  openChat() {
    console.log("Button clicked! Attempting to open popup...");
    this.router.navigate(
      [{ outlets: { popup: ['chat'] }}]
    );   
  }
}

