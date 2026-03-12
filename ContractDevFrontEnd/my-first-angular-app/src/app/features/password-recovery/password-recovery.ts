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
    confirmNewPassword: new FormControl('', [Validators.required]),
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

    const raw = this.passwordResetForm.value;

    const formData = new FormData();

    const payload = {
      Email: raw.email!,
      SecurityQuestion: raw.securityQuestion!,
      SecurityAnswer: raw.securityAnswer!,
      NewPassword: raw.newPassword!,
      ConfirmNewPassword: raw.confirmNewPassword!,
    };

    //appending payload to a formdata
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        formData.append(key, value as any);
      }
    });

    //fetch profile data form the backend
    this.userService.accountRecovery(formData).subscribe({
      next: () => {
        alert('Security settings updated.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        // this.loginError.set('Failed to load profile');
        //this.isLoading.set(false);
        console.error('Incorrect information', err.status, err.error);
      },
    });
  }
}
