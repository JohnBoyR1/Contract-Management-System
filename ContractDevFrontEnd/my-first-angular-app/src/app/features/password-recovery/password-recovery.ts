import { Component, inject, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../core/services/user.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-password-recovery',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './password-recovery.html',
  styleUrl: './password-recovery.css',
})
export class PasswordRecovery {
  //dependency injection
  private userService = inject(UserService);
  private router = inject(Router);
  
  // signal states
  isLoading = signal(false);
  loggedIn = signal(false);
  loginError = signal('');
  updatedPassword = signal(false);

  //form with build-in form validation
  passwordResetForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    securityQuestion: new FormControl('', [Validators.required]),
    securityAnswer: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [Validators.required]),
    confirmNewPassword: new FormControl('', [Validators.required]),
  });
  //for drop down menu 
  securityQuestions = signal([
    'What is your mother’s maiden name?',
    'What was the name of your first pet?',
    'What city were you born in?',
  ]);


  handleAccountRecovery() {
    //force all validation messages to show up 
    this.passwordResetForm.markAllAsTouched();

    //if form is not valid (end)
    if (!this.passwordResetForm.valid) return;

    this.isLoading.set(true);
    this.loginError.set('');

    const raw = this.passwordResetForm.value;

    const formData = new FormData();//formdata to be able to send to back end

    //payload for the formdata 
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
        this.isLoading.set(false);
        this.updatedPassword.set(true);
        //timer to display successfull to user before moving to login page
        setTimeout(() => {
          this.updatedPassword.set(false);
          this.router.navigate(['/login']);
        }, 3000);
        
        
      },
      error: (err) => {
        this.loginError.set(err.message || 'Failed to load profile');
        this.isLoading.set(false);
       
        //timer to display error to user before clearing fields 
        setTimeout(() => {
          this.loginError.set('');
           this.passwordResetForm.reset();
        }, 2500);
       
      },
    });
  }
}
