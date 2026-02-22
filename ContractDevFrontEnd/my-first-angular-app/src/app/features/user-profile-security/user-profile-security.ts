import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLinkActive, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { UserService } from '../../core/services/user.service';
import { ProfileStateService } from '../../core/shared/profile-state.service';
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
  deletionForm: FormGroup;

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
      securityAnswer: ['', Validators.required]
    });

    this.deletionForm = this.fb.group({
      currentPassword: ['', Validators.required],
  
    })
  }

  ngOnInit() {}

  nameDisplay(){
    return `${this.profile.firstName()} ${this.profile.lastName()}`; 
  }

  saveSecurity() {
    if (this.securityForm.invalid) return;

    const raw = this.securityForm.value;

    
    const formData = new FormData();

    

    if (raw.newPassword !== raw.confirmNewPassword) {
      alert("New passwords do not match.");
      return;
    }
    //payload to change password
    const payload = {
      Id: this.authService.getCurrentUserId(),
      currentPassword: raw.currentPassword,
      newPassword: raw.newPassword,
      securityQuestion: raw.securityQuestion,
      securityAnswer: raw.securityAnswer
    };

   
    //appending payload to a formData
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        formData.append(key , value as any);
      }
    });

    this.userService.updateSecurity(formData).subscribe({
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

  securityQuestions = [
    "What is your mother’s maiden name?",
    "What was the name of your first pet?",
    "What city were you born in?"
  ];

  // deletion
  deleteProfile(){
    if (this.securityForm.invalid) return;

    const formDataDelete = new FormData();

    const rawData = this.deletionForm.value;


    const deletePayload = {
      Id: this.authService.getCurrentUserId(),
      currentPassword: rawData.currentPassword,
    };

    //appending payload to a formData
    Object.entries(deletePayload).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        formDataDelete.append(key , value as any);
      }
    });

    this.userService.deleteUserAccount(formDataDelete).subscribe({
      next: () => {
        alert("User Account Deleted.");
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        console.error(err);
        alert("Failed to Delete User Account.");
      }
    });


  }
  // pop up Modal for account deletion
  isOpenDeleteModal = signal(false);

  openModal() {
    this.isOpenDeleteModal.set(true);
    console.log("open modal");
  }

  closeModal() {
    this.isOpenDeleteModal.set(false);
  }

  confirmDelete() {
    console.log("Deleting...");
    this.deleteProfile();
    this.closeModal();
  }


}
