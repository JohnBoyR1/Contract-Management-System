import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { UserService } from '../../core/services/user.service';
import { ProfileStateService } from '../../core/shared/profile-state.service';
import { signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile-deletion',
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule, CommonModule],
  templateUrl: './user-profile-deletion.html',
  styleUrl: './user-profile-deletion.css',
})
export class UserProfileDeletion {
  deletionForm: FormGroup;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);
  public profile = inject(ProfileStateService);

  constructor() {
    this.deletionForm = this.fb.group({
      currentPassword: ['', Validators.required],
      securityQuestion: ['', Validators.required],
      securityAnswer: ['', Validators.required],
    });
  }

  ngOnInit() {}

  nameDisplay() {
    return `${this.profile.firstName()} ${this.profile.lastName()}`;
  }

  // deletion
  deleteProfile() {
    if (this.deletionForm.invalid) return;

    const formDataDelete = new FormData();

    const rawData = this.deletionForm.value;

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
        alert('User Account Deleted.');
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        console.error(err);
        alert('Failed to Delete User Account.');
      },
    });
  }
  // pop up Modal for account deletion
  isOpenDeleteModal = signal(false);

  openModal() {
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
