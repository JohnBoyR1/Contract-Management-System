import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../auth/auth.service';
import { ProfileStateService } from '../../profile-state.service';

@Component({
  selector: 'app-file-upload',

  templateUrl: './file-upload.html',
  styleUrls: ['./file-upload.css'],
})
export class FileUpload {
  private userService = inject(UserService);
  private authService = inject(AuthService);

  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  constructor(
    private http: HttpClient,
    public profile: ProfileStateService,
  ) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    this.selectedFile = file;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => (this.previewUrl = e.target?.result ?? null);
    reader.readAsDataURL(file);
  }

  showPreview() {
  if (!this.selectedFile) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
  };
    reader.readAsDataURL(this.selectedFile);
  }




  upload() {
    if (!this.selectedFile) return;

    const id = this.authService.getCurrentUserId();
    //const extension = this.selectedFile.name.split('.').pop() ?? ''; update due needing the dot to render from backend
    const extension = this.selectedFile.name.includes('.')
    ? '.' + this.selectedFile.name.split('.').pop()
    : '';


    const formData = new FormData();
    formData.append('Id', id.toString());
    //formData.append('Title', 'developer'); ///definitely should not be this
    formData.append('File', this.selectedFile);
    formData.append('Extension', extension);

    console.log('FORM RAW:', formData.values);

    console.log('FORMDATA:');
    for (const entry of formData.entries()) {
      console.log(entry[0], entry[1]);
    }

    this.userService.uploadFile(formData).subscribe(() => {
      this.userService.getProfile(id).subscribe((fullProfile) => {
        this.profile.initProfile(fullProfile);
      });
    });
  }
}
