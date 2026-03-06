import { Component, signal, computed } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
//input signals
import { ProfileStateService } from '../../core/shared/profile-state.service';
import { UserService } from '../../core/services/user.service';
import { Profile } from '../../core/models/profile.models';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile {
  profileForm: FormGroup; //?

  private userService = inject(UserService);
  private authService = inject(AuthService);

  // 2. Inject the Router in the constructor
  constructor(
    private http: HttpClient,

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
      phoneNumber: [''],
      email: [''],
      country: [''],
      description: [''],
      bio: [''],
      twoFactorAuth: [''],
      availableForWork: [false],
      offeringWork: [false],
      displayUserName: [false],
      hidePhoneNumber: [false],
      profileImagePath: [''],
      skills: [''],
      selectedSkills: this.fb.control<string[]>([]),
    });
  }
  // skill set in drop down menu
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

  // Check if skill has been selected
  isSkillDisabled(skill: string): boolean {
    return (this.selectedSkillsControl.value ?? []).includes(skill);
  }

  ngOnInit() {
    //handle the selection
    this.skillsControl.valueChanges.subscribe((skill) => {
      if (!skill) return;

      const current = this.selectedSkillsControl.value ?? [];

      // Add the skill to our 'selected' list if it's not already there
      if (!current.includes(skill)) {
        this.selectedSkillsControl.setValue([...current, skill]);
      }

      // reset dropdown so they can pick again immediately and does not display what has been chosen
      this.skillsControl.setValue('', { emitEvent: false });
    });
    // retrieving the user id
    const id = this.authService.getCurrentUserId();

    //subscribe is used to recieve data asyschronously (returns an Observable)
    this.userService.getProfile(id).subscribe((profile) => {
      this.profileForm.patchValue(profile);

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

  // 3. Handle Skill removal
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
        // selectedSkills = []
        if (key === 'selectedSkills') {
          formData.append('selectedSkills', JSON.stringify(value ?? [])); //check backend
          return;
        }

        formData.append(key, value as any);
      }
    });

    //append ID (as it is not part of the form)
    formData.append('id', id.toString());

    //updating backend and refreshing the global profile state
    this.userService.updateProfile(formData).subscribe(() => {
      this.userService.getProfile(id).subscribe((fullProfile) => {
        this.profile.initProfile(fullProfile);
      });
    });
  }
}
