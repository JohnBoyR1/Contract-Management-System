import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { UserService } from '../services/user.service';
import { ProfileStateService } from '../services/profile-state.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

/*
  authGuard
  ---------
  Protects routes that require authentication.
  Responsibilities:
  1. Ensure the user is logged in
  2. Ensure the user's profile is loaded (for components that depend on it)
  3. Redirect to /login if authentication or profile loading fails
*/


export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const userService = inject(UserService);
  const profileState = inject(ProfileStateService);
  const router = inject(Router);

  //Check login state using SIGNAL
  if (!auth.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  //If profile already loaded, allow navigation
  if (typeof profileState.isProfileLoaded === 'function' && profileState.isProfileLoaded()) {
    return true;
  }

  // Get the logged-in user's ID from AuthService
  const userId = auth.getCurrentUserId();
  // If no ID exists (corrupt token or unexpected state), redirect
  if (!userId) {
    router.navigate(['/login']);
    return false;
  }
  // Fetch profile from API and store it in ProfileStateService
  return userService.getProfile(userId).pipe(
    map(profile => {
      // If profile exists, initialize global profile state
      if (profile) profileState.initProfile(profile);
      return true;  // Allow navigation
    }),
    // If API call fails (expired token, deleted user, etc.)
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};









