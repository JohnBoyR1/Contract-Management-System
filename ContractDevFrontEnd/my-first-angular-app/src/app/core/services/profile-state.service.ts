import { Injectable, signal, computed } from '@angular/core';
import { Profile } from '../models/profile.models';
import { effect } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProfileStateService {
  // Holds the full profile object (change any to Profile (type‑safety, autocompletion, and error‑prevention.))
  private _profile = signal<Profile | null>(null);

  // 1. Define the signal that was missing
  previewUrl = signal<string | null>(null);
  //check this .....(for profile image) temporary
  profileImageUrl = signal<string | null>(null);

  // the actual profile userId 
  userId = computed(() => this._profile()?.userId ?? 0);

  // the actual file selected for upload
  selectedFileForProfile = signal<File | null>(null);

  // Public getter for components
  profile = computed(() => this._profile());

  // Whether profile is loaded
  isProfileLoaded = computed(() => this._profile() !== null);

  // Toggle buttons expose Boolean as its own computed signal
  availableForWork = computed(() => this._profile()?.availableForWork ?? false);

  offeringWork = computed(() => this._profile()?.offeringWork ?? false);

  displayUserName = computed(() => this._profile()?.displayUserName ?? false);

  hidePhoneNumber = computed(() => this._profile()?.hidePhoneNumber ?? false);

  //update profile details
  phoneNumber = computed(() => this._profile()?.phoneNumber ?? '');

  firstName = computed(() => this._profile()?.firstName ?? '');

  lastName = computed(() => this._profile()?.lastName ?? '');

  username = computed(() => this._profile()?.username ?? '');

  bio = computed(() => this._profile()?.bio ?? '');

  email = computed(() => this._profile()?.email ?? '');

  userTitle = computed(() => this._profile()?.userTitle ?? '');

  //social media links
  facebookLink = computed(() => this._profile()?.socials?.["facebook"] ?? "");
  userSocialEmailLink = computed(() => this._profile()?.socials?.["Social Email"] ?? "");
  xLink = computed(() => this._profile()?.socials?.["X"] ?? "");
  githubLink = computed(() => this._profile()?.socials?.["Github"] ?? "");
  linkedinLink = computed(() => this._profile()?.socials?.["LinkedIn"] ?? "");

  //skills = computed(() => this._profile()?.skills ?? '');
  skills = computed(() => this._profile()?.skills ?? []);

  // Called after login or guard fetch
  initProfile(profile: Profile) {
    this._profile.set(profile);

    //Set the real saved image URL
    if (profile.profileImagePath) {
      const fullImageUrl = `${environment.apiUrl}${profile.profileImagePath}`;
      this.profileImageUrl.set(fullImageUrl);
    }

    // reset preview
    this.previewUrl.set(null);
  }

  // Called on logout
  clearProfile() {
    this._profile.set(null);
    this.profileImageUrl.set(null);
    this.previewUrl.set(null);
    this.selectedFileForProfile.set(null);
  }
}

