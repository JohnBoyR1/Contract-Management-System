import { Component, inject, computed } from '@angular/core';
import { ProfileStateService } from '../../profile-state.service';

@Component({
  selector: 'app-profile-skills-modal',
  imports: [],
  standalone: true,
  templateUrl: './profile-skills-modal.html',
  styleUrl: './profile-skills-modal.css',
})
export class ProfileSkillsModal {

  profile = inject(ProfileStateService);

  selectedSkills = this.profile.skills;

   //put firstName and lastName together
  fullName = computed(() => `${this.profile.firstName()} ${this.profile.lastName()}`);
  
  // display name 
  isdisplayUserName() {
    //inline if statement
    return this.profile.displayUserName() ? this.profile.username() : this.fullName();
    
  }
  

}
