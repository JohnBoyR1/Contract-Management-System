import { Component, Input } from '@angular/core';

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
     //inline if statement display the name set by user (toggle Display Username)
    return this.user.displayUserName ? this.user.username : `${this.user.firstName} ${this.user.lastName}`;
    
  }
  // display the skills if any else displays "No Skills added yet."
  selectedSkills(){
    return this.user?.skills ?? []; 
  }
  

}
