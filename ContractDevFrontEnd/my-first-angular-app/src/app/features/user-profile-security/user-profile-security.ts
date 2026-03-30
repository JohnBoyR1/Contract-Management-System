import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLinkActive, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { UserService } from '../../core/services/user.service';
import { ProfileStateService } from '../../core/services/profile-state.service';
import { signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile-security',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule, CommonModule],
  templateUrl: './user-profile-security.html',
  styleUrl: './user-profile-security.css',
})
export class UserProfileSecurity {
  securityForm: FormGroup;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);
  public profile = inject(ProfileStateService);

  //signals
  deleteClicked = signal(false);

  constructor() {
    this.securityForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmNewPassword: ['', Validators.required],
      securityQuestion: ['', Validators.required],
      securityAnswer: ['', Validators.required],
    });
  }

  ngOnInit() {
    const userId = this.authService.getCurrentUserId();

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

  nameDisplay() {
    return `${this.profile.firstName()} ${this.profile.lastName()}`;
  }

  saveSecurity() {
    if (this.securityForm.invalid) return;

    const raw = this.securityForm.value;

    const formData = new FormData();

    if (raw.newPassword !== raw.confirmNewPassword) {
      alert('New passwords do not match.');
      return;
    }
    //payload to change password
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

    this.userService.updateSecurity(formData).subscribe({
      next: () => {
        alert('Security settings updated.');
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        console.error(err);
        alert('Failed to update security settings.');
      },
    });
  }

  securityQuestions = [
    'What is your mother’s maiden name?',
    'What was the name of your first pet?',
    'What city were you born in?',
  ];
}
