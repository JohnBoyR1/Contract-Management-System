import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Profile } from '../../core/models/profile.models';
import { ProfileStateService } from '../../core/shared/profile-state.service';
import { signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ProfileSkillsModal } from '../../core/shared/components/profile-skills-modal/profile-skills-modal';



@Component({
  selector: 'app-profile-display-card',
  imports: [CommonModule, ProfileSkillsModal],
  templateUrl: './profile-display-card.html',
  styleUrl: './profile-display-card.css',
})
export class ProfileDisplayCard  {
  

  constructor(
    private router: Router,
    public profileState: ProfileStateService
  ){}
  @Input() user!: Profile;

  profileImageUrl = signal<string | null>(null);

  ngOnInit() {
    if (this.user.profileImagePath) {
      this.profileImageUrl.set(`${environment.apiUrl}${this.user.profileImagePath}`);
    } else {
      this.profileImageUrl.set(null);
    }
    
  }

  
  displayPhoneNumber(){
    return this.user.hidePhoneNumber ? "User Hidden" : this.user.phoneNumber;
  }

  displayUserNameProfile(){
    return this.user.displayUserName ? this.user.username : `${this.user.firstName} ${this.user.lastName}`;
  }

  displayUserSkills(){
    return this.user.selectedSkills;
  }

  workStatus(){
    if(this.user?.availableForWork && this.user?.offeringWork){
      return "both";
    }else if (this.user?.availableForWork){
      return "available";
    }else if (this.user?.offeringWork) {
      return "offering";
    } else if(this.user?.availableForWork && this.user?.offeringWork){
      return "none";
    }
  }

  //a click handler
  openLink(platform: string) {
    const url = this.user?.socials?.[platform];
    if(url){
       window.open(url, '_blank');
    }else {
      return;
    }
   
  }

  openChat() {
    console.log("Button clicked! Attempting to open popup...");
    this.router.navigate(
      [{ outlets: { popup: ['chat'] }}]
    );   
  }

}
