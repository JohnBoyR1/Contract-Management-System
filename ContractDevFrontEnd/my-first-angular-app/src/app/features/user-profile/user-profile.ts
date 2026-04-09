import { Component, signal} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import { ProfileStateService } from '../../core/services/profile-state.service';
import { UserService } from '../../core/services/user.service';
import { inject } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule, MatTooltipModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})

export class UserProfile {

  profileForm: FormGroup;
  
  private userService = inject(UserService);
  private authService = inject(AuthService);

  //signals
  updateError = signal('');
  updateSuccess = signal(false);
 
 

  //Inject the Router in the constructor
  constructor(
    private router: Router,
    private fb: FormBuilder, //FormBuilder is a built in angular ?
    public profile: ProfileStateService, //then I can use {{ profile.firstName() }} etc.
  ) {
    this.profileForm = this.fb.group({
      userId: [this.authService.getCurrentUserId()], // set sub()
      userTitle: [''], //? after last update 23/02/2026
      firstName: [''],
      lastName: [''],
      username: [''],
      phoneNumber: ['', 
        [
          Validators.required,
          Validators.pattern(/^[0-9]{7,15}$/) // only digits, length 7–15
        ]
      ],
      email: ['',
        [
          Validators.required,
          Validators.email
        ]
      ],
      country: [''],
      description: [''],
      bio: [''],
      twoFactorAuth: [''],
      availableForWork: [false],
      offeringWork: [false],
      displayUserName: [false],
      hidePhoneNumber: [false],
      profileImagePath: [''],

      //social media links
      facebookLink: [''],
      userSocialEmailLink: [''],
      xLink: [''],
      gitHubLink: [''],
      linkedinLink: [''],
      
      skills: this.fb.control<string>(''),
      selectedSkills: this.fb.control<string[]>([]),// backend expects List<String>
    });
  }

   //skill set in drop down menu
  get skillsControl() {
    return this.profileForm.get('skills') as FormControl<string>;
  }
  // skill selected in drop down ment
  get selectedSkillsControl() {
    return this.profileForm.get('selectedSkills') as FormControl<string[]>;
  }

  //list of all skills to choose from
  skillsList = signal([
    'Angular',
    'AWS',
    'Backend',
    'Bootstrap',
    'C',
    'C#',
    'C++',
    'Cloud Developer',
    'CSS',
    'Database Developer',
    'Docker',
    'Frontend',
    'Full Stack',
    'Go',
    'HTML',
    'Java',
    'JavaScript',
    'Mobile Developer',
    'MongoDB',
    'MySQL',
    'PostgreSQL',
    'Python',
    'React',
    'Rust',
    'TypeScript',
    'Web Developer',
  ]);

   // Get the list of skills that are NOT in the selected array
  get availableSkills() {
    const selected = this.selectedSkillsControl.value ?? [];
    return this.skillsList().filter((skill) => !selected.includes(skill));
  }

  // Check if skill has been selected?????
  isSkillDisabled(skill: string): boolean {
    return (this.selectedSkillsControl.value ?? []).includes(skill);
  }

  ngOnInit() {
   
    //handle the selection
    this.skillsControl.valueChanges.subscribe((skill) => {
      if (!skill || skill == '') return;

      const current = this.selectedSkillsControl.value ?? [];

      // Add the skill to the 'selected' list if it's not already there
      if (!current.includes(skill)) {
        this.selectedSkillsControl.setValue([...current, skill]);
      }

      // reset dropdown so they can pick again immediately and does not display what has been chosen
      this.skillsControl.setValue('', { emitEvent: false });
    });
    // retrieving the user id
    const id = this.authService.getCurrentUserId();

    //subscribe is used to recieve data asyschronously (returns an Observable)
    this.userService.getProfile(id!).subscribe((profile: any) => {
      
      // Convert backend comma string → array
      if (typeof profile.skills === 'string') {
        profile.skills = profile.skills
          .split(',')
          .map((s: string) => s.trim())
          .filter((s: string) => s.length > 0);
      }
      
      this.profileForm.patchValue(profile);

      // Ensure selectedSkills is an array
      this.selectedSkillsControl.setValue(profile.skills ?? []);

      //updating global profile state
      this.profile.initProfile(profile);
    });
  }
  //Display First Name and Last Name
  nameDisplay() {
    return `${this.profile.firstName()} ${this.profile.lastName()}`;
  }

  //User title e.g Role currently in the tech sector
  titleDisplay() {
    return `${this.profile.userTitle()}`;
  }

  //Handle Skill removal
  removeSkill(skillToRemove: string) {
    const current = this.selectedSkillsControl.value ?? [];
    this.selectedSkillsControl.setValue(current.filter((s) => s !== skillToRemove));
  }

  saveProfile() {
    const id = this.authService.getCurrentUserId();

    const raw = this.profileForm.value;

    const formData = new FormData();

    // append all text fields (underscore instead of key (We only care about the values))
    Object.entries(raw).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        // selectedSkills = [   ]
        if (key === 'selectedSkills') {
          (value as string[]).forEach(skill => {  
            formData.append('skills', skill); // <-- backend expects "Skills"
          });
          return;
        }

          formData.append(key, value as any);
      }
    });

    //append ID (as it is not part of the form)
    formData.append('id', id!.toString());

    //updating backend and refreshing the global profile state
    this.userService.updateProfile(formData).subscribe({
      next: (response: any) => {

        //check if any changes if not inform user no changes
        if(!response?.updated){
          this.updateError.set("No changes were made.");
          //display message and then reset page
          setTimeout(() => {
              this.updateError.set('');
              //navigate to the home page
              this.router.navigate(['/user-profile']);
            }, 2500);
            
        }else{

          this.updateSuccess.set(true);
          //display message and then reset page
          setTimeout(() => {
                this.updateSuccess.set(false);
                //navigate to the home page
                this.router.navigate(['/user-profile']);
              }, 2000);
        }   
        //refresh the profile
        this.userService.getProfile(id!).subscribe((fullProfile) => {
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

     
        
  

   





  
 
  

 

  


  