import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from "@angular/router";
import { FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { UserService } from '../../core/services/user.service';
import { ProfileStateService } from '../../core/services/profile-state.service';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'app-social-media-links',
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule, CommonModule, MatTooltipModule],
  templateUrl: './social-media-links.html',
  styleUrl: './social-media-links.css',
})
export class SocialMediaLinks {


  //dependency injection
  private authService = inject(AuthService);
  private userService = inject(UserService);
  public profile = inject(ProfileStateService);
  public router = inject(Router);

  // signal states 
  updateError = signal('');
  updateSuccess = signal(false);

  //unique id of the user
  private id = this.authService.getCurrentUserId();

  //formGroup data
  socialForm = new FormGroup({
    
    facebookLink: new FormControl(''),
    userSocialEmailLink: new FormControl(''),
    xLink: new FormControl(''),
    gitHubLink: new FormControl(''),
    linkedinLink: new FormControl(''),

  });

  ngOnInit() {
   //populate the input fields related to the links with the data from the backend
    this.userService.getProfile(this.id).subscribe(profile => {
      this.socialForm.patchValue({
        facebookLink: profile.socials["facebook"],
        userSocialEmailLink: profile.socials["Social Email"],
        xLink: profile.socials["X"],
        gitHubLink: profile.socials["Github"],
        linkedinLink: profile.socials["LinkedIn"]
      });
    });
  }

  saveSocialForm(){
    
   
    //make things easier 
    const raw = this.socialForm.value;

    //form data to send to backend
    const formData = new FormData();

    formData.append('Id', this.id.toString());

    formData.append('FacebookLink', raw.facebookLink);
    
    formData.append('UserSocialEmailLink', raw.userSocialEmailLink);
    
    formData.append('XLink', raw.xLink);
  
    formData.append('GitHubLink', raw.gitHubLink);
    
    formData.append('LinkedinLink', raw.linkedinLink);
    
     //updating backend and refreshing the global profile state
    this.userService.updateProfile(formData).subscribe({
      next: (response: any) => {

        //check if any changes if not? inform user no changes were made
        if(!response?.updated){
          this.updateError.set("No changes were made.");
          //display message and then reset page
          setTimeout(() => {
              this.updateError.set('');
              //navigate to the social-media-links page
              this.router.navigate(['/social-media-links']);
            }, 2000);
          return;
        }

        this.updateSuccess.set(true);
        //display message and then reset page
        setTimeout(() => {
              this.updateSuccess.set(false);
              //navigate to the profile-card page
              this.router.navigate(['/profile-card']);
            }, 2500);
       
        //refresh the profile
        this.userService.getProfile(this.id).subscribe((fullProfile) => {
          this.profile.initProfile(fullProfile);
        });
      },
      error: (err) => {
        this.updateError.set("Update failed: " + err.message || 'Failed to update profile');
        console.error("Update failed:", err);
      }  
    });
  }

}





