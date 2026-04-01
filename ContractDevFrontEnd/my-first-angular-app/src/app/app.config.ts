/*
This file wires up(puts it all together):
  Routing
  HttpClient and Interceptors
  App initializers
  Global providers (e.g., Material Dialog)
  No theme logic or UI logic belongs here.
*/
import { ApplicationConfig, importProvidersFrom, provideAppInitializer, inject } from '@angular/core';
import { provideRouter, withRouterConfig, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { firstValueFrom, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatDialogModule } from '@angular/material/dialog';
import { routes } from './app.routes';
import { AuthService } from './core/auth/auth.service';
import { UserService } from './core/services/user.service';
import { ProfileStateService } from './core/services/profile-state.service';
import { authInterceptor } from './core/auth/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

/*
  createProfileInitializer()
  Purpose:
  - Runs BEFORE Angular bootstraps the app.
  - If a valid JWT token exists, load the user's profile once at startup.
  - Prevents components from loading before profile data is available.
  - Uses Angular's inject() API (v16+) to access services inside the initializer.
  Why it's needed:
  - Without this, refreshing the page would lose profile state.
  - Components depending on profile data would flicker or break.
  - Ensures a smooth "already logged in" experience.
*/
export function createProfileInitializer() {
  return () => {
    const auth = inject(AuthService);
    const userService = inject(UserService);
    const profileState = inject(ProfileStateService);

    const userId = auth.getCurrentUserId();
    if (!userId) return Promise.resolve();

    // Skip if profile already loaded (signal-based check)
    if (profileState.isProfileLoaded()) {
      return Promise.resolve();
    }

    // Fetch profile and initialize state
    return firstValueFrom(
      userService.getProfile(userId).pipe(
        catchError(() => of(null)) // App still boots even if request fails
      )
    ).then(profile => {
      if (profile) profileState.initProfile(profile);
    });
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    /*
      Router configuration
      - Registers all app routes.
      - Enables scroll restoration when navigating back.
      - Forces Angular to reload components when navigating to the same URL.
    */
    provideRouter(
      routes,
      withRouterConfig({ onSameUrlNavigation: 'reload' }),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })
    ),

    /*
      HttpClient and Interceptors
      - Registers HttpClient globally.
      - Adds authInterceptor (attaches JWT token).
      - Adds errorInterceptor (normalizes backend errors).
      - This is the modern Angular v16+ way to register interceptors.
    */
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),

    /*not sure if need (used like build in angular modals)
      Material Dialog
      - Makes Angular Material dialogs available app-wide.
    */
    importProvidersFrom(MatDialogModule),

    /*
      App Initializer
      - Runs BEFORE the app starts.
      - Loads the user's profile if a valid token exists.
      - Ensures profile dependent components have data immediately.
    */
    provideAppInitializer(createProfileInitializer())
  ]
};







