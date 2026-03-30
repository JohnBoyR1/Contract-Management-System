import { Component, inject, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../core/services/user.service';
import { ProfileStateService } from '../../core/services/profile-state.service';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css', //link style sheet
})
export class Login {
  //dependency injection 
  private userService = inject(UserService);
  private profileState = inject(ProfileStateService);
  private router = inject(Router);
  private authService = inject(AuthService);

 
  //signals for state management
  isLoading = signal(false);
  loggedIn = signal(false);
  loginError = signal('');

  //reactive form with build-in validation
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  

  //main login handler: Auth -> ID retrieval -> profile loading and navigation
  handleLogin() {
    //force all validation messages to show up 
    this.loginForm.markAllAsTouched();

    //if form not valid do not proceed
    if (!this.loginForm.valid) return;

    //set isLoading state to true and clear previous loginError
    this.isLoading.set(true);
    this.loginError.set('');

    //prepare credentials for form-data submission
    const formData = new FormData();
    formData.append('email', this.loginForm.value.email!);
    formData.append('password', this.loginForm.value.password!);

    //authenticate the user
    this.authService.login(formData).subscribe({
      next: () => {
        //retrieve the unique user Id (from a decoded JWT)
        const userId = this.authService.getCurrentUserId();

        //check if the token/id retrieval fails
        if (!userId) {
          this.loginError.set('Could not decode user ID');
          this.isLoading.set(false);
          return;
        }

        //fetch full profile data and update  global profile signals(state)
        this.userService.getProfile(userId).subscribe({
          next: (profile) => {
            //saving the profile data into the global profile signal
            this.profileState.initProfile(profile);

            //set states
            this.isLoading.set(false);
            this.loggedIn.set(true);

            setTimeout(() => {
              this.loggedIn.set(false);
              //navigate to the home page
              this.router.navigate(['/home']);
            }, 3000);
           
           
          },
          error: (err) => {
            // 'err' here is the object from the errorInterceptor
            this.loginError.set(err.message || 'Failed to load profile');
            this.isLoading.set(false);
            console.error('?', err.status, err.error);
          },
        });
      },
      error: (err) => {
        // integrate with the errorInterceptor instead of hardcoding 'Invalid Email' show what the interceptor found
        this.loginError.set(err.message || 'Invalid email or password');
        this.isLoading.set(false);
      },
    });
  }
}
