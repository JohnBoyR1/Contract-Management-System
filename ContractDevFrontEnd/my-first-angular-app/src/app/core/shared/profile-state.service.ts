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

  /*
  profilePicture = computed(() => this._profile()?.profilePicture ?? '');

  // file selected by user (no preview logic)
  selectedFileForProfile = signal<File | null>(null);

  previewPicture = computed(() => {
    const profileFile = this.selectedFileForProfile();
    if (profileFile) {
      return URL.createObjectURL(profileFile);
    }
    return this._profile()?.profilePicture ?? '';
  });*/



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

/* manages one logged in user's profile using signals *

import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Profile } from '../models/profile.models';

@Injectable({ providedIn: 'root' })
export class ProfileStateService {
  constructor(private http: HttpClient) {}

  //need userId
  userId = '';

  //signals restored from saved state(profile settings)
  //toggle buttons
  availableForWork = signal(false);
  offeringWork = signal(false);
  displayUserName = signal(false);
  hidePhoneNumber = signal(false);
  //string inputs
  phoneNumber = signal(''); //store the actual number
  firstName = signal(''); //store the actual firstName
  lastName = signal(''); //store the actual lastName
  username = signal(''); //store the actual username
  email = signal(''); //store the actual email
  country = signal(''); //store the 2 character country code
  description = signal(''); //radio btn choice "developer" | "client" | "Both"
  bio = signal(''); //text area (brief description about user)

  //####indicates wheather a profile has been loaded into signals
  isProfileLoaded = signal(false);

  //Once retrieve user's profile from backend, back end returns a profile object
  //then initialise an object and loads it into signals
  initProfile(profile: Profile | null) {
    if (!profile) {
      this.isProfileLoaded.set(false);
      return;
    }

    //user id //because it does not change it is not a signal
    this.userId = String(profile.userId ?? this.userId);
    //toggles
    this.availableForWork.set(profile.availableForWork);
    this.offeringWork.set(Boolean(profile.offeringWork));
    this.displayUserName.set(Boolean(profile.displayUserName));
    this.hidePhoneNumber.set(Boolean(profile.hidePhoneNumber));

    //profile information fields
    this.phoneNumber.set(profile.phoneNumber ?? '');
    this.firstName.set(profile.firstName ?? '');
    this.lastName.set(profile.lastName ?? '');
    this.username.set(profile.username ?? '');
    this.email.set(profile.email ?? '');
    this.country.set(profile.country ?? '');
    //radio btn choice "developer" | "client" | "Both"
    this.description.set(profile.description ?? '');
    this.bio.set(profile.bio ?? '');

    this.isProfileLoaded.set(true);
  }

  updateProfileBackend(changes: any) {
    return this.http.patch(`/users/${this.userId}/profile`, changes).subscribe(() => {
      // After saving, force a fresh GET from backend
      this.http.get<Profile>(`/users/${this.userId}/profile`).subscribe((fullProfile) => {
        console.log('FULL PROFILE FROM BACKEND:', fullProfile);
        this.initProfile(fullProfile);
      });
    });
  }

  clearProfile() {
    this.userId = '';
    this.availableForWork.set(false);
    this.offeringWork.set(false);
    this.displayUserName.set(false);
    this.hidePhoneNumber.set(false);
    this.phoneNumber.set('');
    this.firstName.set('');
    this.lastName.set('');
    this.username.set('');
    this.email.set('');
    this.country.set('');
    this.description.set('');
    this.bio.set('');
    this.isProfileLoaded.set(false);
  }

  hasProfileLoaded(): boolean {
    return this.isProfileLoaded();
  }
}*/
