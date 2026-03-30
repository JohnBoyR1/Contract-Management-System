import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { UserService } from '../services/user.service';
import { ProfileStateService } from '../services/profile-state.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const userService = inject(UserService);
  const profileState = inject(ProfileStateService);
  const router = inject(Router);

  // 1. Check login state using SIGNAL
  if (!auth.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  // 2. If profile already loaded, allow navigation
  if (typeof profileState.isProfileLoaded === 'function' && profileState.isProfileLoaded()) {
    return true;
  }

  // 3. Otherwise fetch profile
  const userId = auth.getCurrentUserId();
  if (!userId) {
    router.navigate(['/login']);
    return false;
  }

  return userService.getProfile(userId).pipe(
    map(profile => {
      if (profile) profileState.initProfile(profile);
      return true;
    }),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};









/* auth.guard.ts
import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { of } from 'rxjs';
import { take, switchMap, map, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { UserService } from '../services/user.service';
import { ProfileStateService } from '../shared/profile-state.service';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const userService = inject(UserService);
  const profileState = inject(ProfileStateService);
  const router = inject(Router);

  return auth.isLoggedIn$.pipe(
    take(1),
    switchMap(isLoggedIn => {
      if (!isLoggedIn) {
        // Not logged in -> redirect to login
        router.navigate(['/login']);
        return of(false);
      }

      // If profile already loaded, allow navigation immediately
      if (typeof profileState.isProfileLoaded === 'function' && profileState.isProfileLoaded()) {
        return of(true);
      }

      // Otherwise fetch profile, initialize signals, then allow navigation
      const userId = auth.getCurrentUserId();
      if (!userId) {
        router.navigate(['/login']);
        return of(false);
      }

      return userService.getProfile(userId).pipe(
        take(1),
        map(profile => {
          if (profile) profileState.initProfile(profile);
          return true;
        }),
        catchError(() => {
          // On error (404/401/etc.) redirect to login or profile-setup
          router.navigate(['/login']);
          return of(false);
        })
      );
    })
  );
};*/