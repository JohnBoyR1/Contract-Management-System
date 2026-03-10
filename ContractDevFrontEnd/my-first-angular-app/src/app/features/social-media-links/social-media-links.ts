import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from "@angular/router";
import { FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { UserService } from '../../core/services/user.service';
import { ProfileStateService } from '../../core/shared/profile-state.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-social-media-links',
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule, CommonModule],
  templateUrl: './social-media-links.html',
  styleUrl: './social-media-links.css',
})
export class SocialMediaLinks {

  private authService = inject(AuthService);
  private userService = inject(UserService);
  
  public profile = inject(ProfileStateService);

  socialForm = new FormGroup({
    
    facebookLink: new FormControl(''),
    userSocialEmailLink: new FormControl(''),
    xLink: new FormControl(''),
    gitHubLink: new FormControl(''),
    linkedinLink: new FormControl(''),

  });

  saveSocialForm(){
    
    const id = this.authService.getCurrentUserId();
    //make things easier 
    const raw = this.socialForm.value;

    //form data
    const formData = new FormData();

   
    formData.append('Id', id.toString());

    formData.append('FacebookLink', raw.facebookLink);
    
    formData.append('UserSocialEmailLink', raw.userSocialEmailLink);
    
    formData.append('XLink', raw.xLink);
  
    formData.append('GitHubLink', raw.gitHubLink);
    
    formData.append('LinkedinLink', raw.linkedinLink);
    


    //updating backend and refreshing the global profile state
    this.userService.updateProfile(formData).subscribe(() => {
      this.userService.getProfile(id).subscribe((fullProfile) => {
        this.profile.initProfile(fullProfile);
      });
    });
  }

}





