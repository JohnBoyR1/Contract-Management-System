import { Component, inject, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../core/services/user.service';
import { ProfileStateService } from '../../core/shared/profile-state.service';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-password-recovery',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './password-recovery.html',
  styleUrl: './password-recovery.css',
})
export class PasswordRecovery {
  private userService = inject(UserService);
  private profileState = inject(ProfileStateService);
  private router = inject(Router);
  private authService = inject(AuthService);

  private apiUrl = `${environment.apiUrl}/api`;

  isLoading = signal(false);
  loggedIn = signal(false);
  loginError = signal('');

  passwordResetForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    securityQuestion: new FormControl('', [Validators.required]),
    securityAnswer: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [Validators.required]),
    reEnterNewPassword: new FormControl('', [Validators.required]),
  });

  securityQuestions = signal([
    'What is your mother’s maiden name?',
    'What was the name of your first pet?',
    'What city were you born in?',
  ]);

  handleLogin() {
    if (!this.passwordResetForm.valid) return;

    this.isLoading.set(true);
    this.loginError.set('');

    const formData = new FormData();
    formData.append('email', this.passwordResetForm.value.email!);
    formData.append('securityQuestion', this.passwordResetForm.value.securityQuestion!);
    formData.append('securityAnswer', this.passwordResetForm.value.securityAnswer!);
    formData.append('newPassword', this.passwordResetForm.value.newPassword!);
    formData.append('reEnterNewPassword', this.passwordResetForm.value.reEnterNewPassword!);
    //fetch profile data form the backend
    this.authService.login(formData).subscribe({
      next: (res) => {
        //console.log("Status:", res.status);
        //console.log("Message: ", res.body);

        const userId = this.authService.getCurrentUserId();

        //update the profile data
        if (!userId) {
          this.loginError.set('Could not decode user ID');
          this.isLoading.set(false);
          return;
        }
        //fetch profile and update profile signals
        this.userService.getProfile(userId).subscribe({
          next: (profile) => {
            this.profileState.initProfile(profile);
            //navigate to the home page
            this.isLoading.set(false);
            this.loggedIn.set(true);
            this.router.navigate(['/home']);
          },
          error: (err) => {
            this.loginError.set('Failed to load profile');
            this.isLoading.set(false);
            console.error('?', err.status, err.error);
          },
        });
      },
      error: () => {
        this.loginError.set('Invalid email or password');
        this.isLoading.set(false);
      },
    });
  }
}
