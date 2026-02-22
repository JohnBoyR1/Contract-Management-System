import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLinkActive, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { UserService } from '../../core/services/user.service';
import { ProfileStateService } from '../../core/shared/profile-state.service';
import { routes } from '../../app.routes';


@Component({
  selector: 'app-user-profile-security',
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule],
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

  constructor() {
    this.securityForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmNewPassword: ['', Validators.required],
      securityQuestion: ['', Validators.required],
      securityAnswer: ['', Validators.required]
    });
  }

  ngOnInit() {}

  nameDisplay(){
    return `${this.profile.firstName()} ${this.profile.lastName()}`; 
  }

  saveSecurity() {
    if (this.securityForm.invalid) return;

    const id = this.authService.getCurrentUserId();
    const raw = this.securityForm.value;

    if (raw.newPassword !== raw.confirmNewPassword) {
      alert("New passwords do not match.");
      return;
    }

    const payload = {
      currentPassword: raw.currentPassword,
      newPassword: raw.newPassword,
      securityQuestion: raw.securityQuestion,
      securityAnswer: raw.securityAnswer
    };

    this.userService.updateSecurity(id, payload).subscribe({
      next: () => {
        alert("Security settings updated.");
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        console.error(err);
        alert("Failed to update security settings.");
      }
    });
  }

}
