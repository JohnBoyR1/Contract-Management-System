
import { Component, inject, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../auth/auth.service';
import { ProfileStateService } from '../../../services/profile-state.service';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'app-file-upload',
  imports: [MatTooltipModule],
  templateUrl: './file-upload.html',
  styleUrls: ['./file-upload.css'],
})
export class FileUpload {
  private userService = inject(UserService);
  private authService = inject(AuthService);

  // The file the user picked
  selectedFile: File | null = null;

  // The preview image shown on screen
  previewUrl: string | ArrayBuffer | null = null;

  @ViewChild('fileInput', { static: false}) 
  fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private http: HttpClient,
    public profile: ProfileStateService,
  ) {}

  // Runs when the user selects a file
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    // If no file was chosen, stop here
    if (!file) return;

    this.selectedFile = file;

    // Create a preview image
    const reader = new FileReader();
    reader.onload = e => (this.previewUrl = e.target?.result ?? null);
    reader.readAsDataURL(file);
  }

  // Shows the preview again (optional button)
  showPreview() {
    if (!this.selectedFile) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };
    reader.readAsDataURL(this.selectedFile);
  }

  // Removes the preview and clears the selected file
  clearPreview() {
    this.previewUrl = null;
    this.selectedFile = null;

    // This is required or Angular will not reset the file input
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }

  }

  // Uploads the file to the server
  upload() {
    if (!this.selectedFile) return;

    const id = this.authService.getCurrentUserId();

    // Build the form data to send to the backend
    const formData = new FormData();
    formData.append('Id', id.toString());
    formData.append('File', this.selectedFile);

    // Log what is being sent (useful for debugging)
    console.log('FORMDATA ENTRIES:');
    for (const entry of formData.entries()) {
      console.log(entry[0], entry[1]);
    }

    // Upload the file
    this.userService.uploadFile(formData).subscribe(() => {
      // After upload, refresh the user's profile
      this.userService.getProfile(id).subscribe(fullProfile => {
        this.profile.initProfile(fullProfile);
      });
    });
  }
}



































