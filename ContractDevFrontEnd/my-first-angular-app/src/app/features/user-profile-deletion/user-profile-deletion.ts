import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { UserService } from '../../core/services/user.service';
import { ProfileStateService } from '../../core/services/profile-state.service';
import { signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-user-profile-deletion',
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule, CommonModule, MatTooltipModule],
  templateUrl: './user-profile-deletion.html',
  styleUrl: './user-profile-deletion.css',
})
export class UserProfileDeletion {
  //reactive form for deletion inputs
  deletionForm: FormGroup;

  // injected services
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);
  public profile = inject(ProfileStateService);

  //signals for UI feedback
  deleteSuccess = signal(false);
  deleteError = signal('');

  constructor() {
    //initialise form
    this.deletionForm = this.fb.group({
      currentPassword: ['', Validators.required],
      securityQuestion: ['', Validators.required],
      securityAnswer: ['', Validators.required],
    });
  }

  ngOnInit() {}

  //display full name 
  nameDisplay() {
    return `${this.profile.firstName()} ${this.profile.lastName()}`;
  }

  // deletion handler
  deleteProfile() {

    //prevents form submission if form is invalid
    if (this.deletionForm.invalid) return;

    const formDataDelete = new FormData();

    const rawData = this.deletionForm.value;
    //build api for API
    const deletePayload = {
      Id: this.authService.getCurrentUserId(),
      Password: rawData.currentPassword,
      SecurityAnswer: rawData.securityAnswer
    };

    //appending payload to a formData
    Object.entries(deletePayload).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        formDataDelete.append(key, value as any);
      }
    });

    this.userService.deleteUserAccount(formDataDelete).subscribe({
      next: () => {
        
        this.deleteSuccess.set(true);

        //display success to user for a set time
        setTimeout(() => {
          this.deleteSuccess.set(false);
          this.router.navigate(['/home']);
        }, 2000);
        
      },
      error: (err) => {
        
        this.deleteError.set('Failed to Delete User Account: ' + err.message);

        //display error to user for a set time
        setTimeout(() => {
          this.deleteError.set('');
          this.router.navigate(['/userProfileDeletion']);
        }, 2000);
      },
    });
  }
  // pop up Modal for account deletion
  isOpenDeleteModal = signal(false);

  //used to verify deletion ( to prevent accidental account deletion )
  openModal() {
    this.deletionForm.markAllAsTouched();
    this.isOpenDeleteModal.set(true);
    console.log('open modal');
  }

  closeModal() {
    this.isOpenDeleteModal.set(false);
  }

  confirmDelete() {
    console.log('Deleting...');
    this.deleteProfile();
    this.closeModal();
  }

  securityQuestions = signal([
    'What is your mother’s maiden name?',
    'What was the name of your first pet?',
    'What city were you born in?',
  ]);
}
