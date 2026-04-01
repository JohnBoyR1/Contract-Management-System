import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLinkActive, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { UserService } from '../../core/services/user.service';
import { ProfileStateService } from '../../core/services/profile-state.service';
import { signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-user-profile-security',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule, CommonModule, MatTooltipModule],
  templateUrl: './user-profile-security.html',
  styleUrl: './user-profile-security.css',
})
export class UserProfileSecurity {
  // Reactive form for password + security question updates
  securityForm: FormGroup;
  // Inject required service
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);
  public profile = inject(ProfileStateService);

  //signals
  deleteClicked = signal(false);
  updateSuccess = signal(false);
  updateError = signal('');
 
  constructor() {
    // Build the form + attach password match validator
    this.securityForm = this.fb.group({
        currentPassword: ['', Validators.required],
        newPassword: ['', Validators.required],
        confirmNewPassword: ['', Validators.required],
        securityQuestion: ['', Validators.required],
        securityAnswer: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator } //  custom validator below

    );
  }

  //password match confirm password validation
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmNewPassword')?.value;
    
    if (!password || !confirmPassword) {
      return null; //if either password is no value no point evaluating them
    }
    
    return password === confirmPassword ? null : { passwordsDontMatch: true };
  }

  ngOnInit() {
    const userId = this.authService.getCurrentUserId();
    // Load the user's existing security question
    this.userService.getProfile(userId).subscribe((profile) => {
      this.securityForm.patchValue({
        securityQuestion: profile.securityQuestion,
      });
    });
  }

  //displaying the security question that the account holder used on sign up
  displaySecurityQuestion() {
    const userId = this.authService.getCurrentUserId();
    this.userService.getProfile(userId).subscribe((profile) => {
      return profile.securityQuestion;
    });
  }
  //Display the user's full name from global profile 
  nameDisplay() {
    return `${this.profile.firstName()} ${this.profile.lastName()}`;
  }

  saveSecurity() {
    // Force all fields to show validation errors
    this.securityForm.markAllAsTouched();


    // Stop if form is invalid
    if (this.securityForm.invalid) return;

    const raw = this.securityForm.value;

    const formData = new FormData();
    
    //payload for backend to change password
    const payload = {
      Id: this.authService.getCurrentUserId(),
      CurrentPassword: raw.currentPassword,
      NewPassword: raw.newPassword,
      ConfirmNewPassword: raw.confirmNewPassword,
      SecurityAnswer: raw.securityAnswer,
    };

    //appending payload to a formData
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        formData.append(key, value as any);
      }
    });
    // Submit to backend
    this.userService.updateSecurity(formData).subscribe({
      next: () => {
        
        this.updateSuccess.set(true);
        setTimeout(() => {
          this.updateSuccess.set(false);
          this.router.navigate(['/profile']);
        }, 2500)
      },
      error: (err) => {
        
        //alert('Failed to update security settings.');

        this.updateError.set('Failed to update security settings: ' + err.message || 'Failed to update password');

        setTimeout(()=> {
          this.updateError.set('');
          this.router.navigate(['/userProfileSecurity']);
        }, 2500)
      },
    });
  }

  // Security questions available for selection
  securityQuestions = [
    'What is your mother’s maiden name?',
    'What was the name of your first pet?',
    'What city were you born in?',
  ];
}
