import { Component, inject, Input, computed } from '@angular/core';

import { Profile } from '../../../models/profile.models';

@Component({
  selector: 'app-profile-skills-modal',
  imports: [],
  standalone: true,
  templateUrl: './profile-skills-modal.html',
  styleUrl: './profile-skills-modal.css',
})
export class ProfileSkillsModal {
  //view individual users
  @Input() user!: Profile;

  isdisplayUserName() {
     //inline if statement
   // return this.user.displayUserName ? this.user.username : this.fullName;
   return this.user.lastName; 
  }

  selectedSkills(){
    return this.user?.skills ?? []; 
  }
  

}
