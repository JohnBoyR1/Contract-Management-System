import { Injectable, signal } from '@angular/core';
import { Profile } from '../models/profile.models';

@Injectable({ providedIn: 'root' })
export class SelectedProfileStateService {
  selectedProfile = signal<Profile | null>(null);

  setProfile(profile: Profile) {
    this.selectedProfile.set(profile);
  }

  clear() {
    this.selectedProfile.set(null);
  }
}