// app.config.ts
import { ApplicationConfig, importProvidersFrom, provideAppInitializer, inject } from '@angular/core';
import { provideRouter, withRouterConfig, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { firstValueFrom, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatDialogModule } from '@angular/material/dialog';

import { routes } from './app.routes';
import { AuthService } from './core/auth/auth.service';
import { UserService } from './core/services/user.service';
import { ProfileStateService } from './core/shared/profile-state.service';
import { authInterceptor } from './core/auth/auth.interceptor';


// Factory that injects services inside using `inject()` and returns the initializer function.
// This is the v19+ pattern: provideAppInitializer(factory()) where factory uses inject().
export function createProfileInitializer() {
  return () => {
    const auth = inject(AuthService);
    const userService = inject(UserService);
    const profileState = inject(ProfileStateService);

    const userId = auth.getCurrentUserId(); //returns current id from token
    if (!userId) return Promise.resolve();

    // If profile already loaded, skip
    if (profileState.hasProfileLoaded()) {
      return Promise.resolve();
    }
    // If you used a signal `profileLoaded`, you can check profileState.profileLoaded()

    return firstValueFrom(
      userService.getProfile(userId).pipe(
        catchError(() => of(null)) // swallow errors so bootstrap continues
      )
    ).then(profile => {
      if (profile) profileState.initProfile(profile);
    });
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withRouterConfig({ onSameUrlNavigation: 'reload' }),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })
    ),

    // Register HTTP client and JWT interceptor
    provideHttpClient(withInterceptors([authInterceptor])),

    // Material providers if needed
    importProvidersFrom(MatDialogModule),

    // Provide the initializer (call the factory to get the initializer function)
    provideAppInitializer(createProfileInitializer())
  ]
};


















/*#######################################################################################################################*/

/*import { ApplicationConfig, isStandalone, provideBrowserGlobalErrorListeners, importProvidersFrom } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withRouterConfig } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { authInterceptor } from './core/auth/auth.interceptor';





export const appConfig: ApplicationConfig = {
  providers: [
    
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      //force the router to fire even on same-page clicks
      withRouterConfig({ onSameUrlNavigation: 'reload' }),
      //Automatically jumps to the tip of the page on click
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled'})
    ),  
    provideHttpClient(withInterceptors([authInterceptor])), //registers JWT interceptor globally
    importProvidersFrom(MatDialogModule),
  ]

  
};*/


/*##########################################################################################################################*/
//setting up the ""XSRF-TOKEN", "X-XSRF-TOKEN"" it'll allow for the communication between angular and asp api to be secure and prevent that cross-site request forgery

/* 
How to set it up
1. On the ASP.NET Core Side
You need to tell the API to produce the cookie and validate the incoming header. In your Program.cs:

C# 
builder.Services.AddAntiforgery(options => 
{
    // This is the header name Angular expects by default
    options.HeaderName = "X-XSRF-TOKEN"; 
});

var app = builder.Build();

// Middleware to send the cookie to the client on the first request
app.Use((context, next) =>
{
    var tokens = app.Services.GetRequiredService<IAntiforgery>().GetAndStoreTokens(context);
    context.Response.Cookies.Append("XSRF-TOKEN", tokens.RequestToken!, 
        new CookieOptions { HttpOnly = false }); // Must be false so Angular can read it
    return next(context);
});

//
2. On the Angular Side
Angular is actually "pre-configured" for this, but you have to opt-in by importing the provider in your app.config.ts or app.module.ts:

TypeScript

import { provideHttpClient, withXsrfConfiguration } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN', // default
        headerName: 'X-XSRF-TOKEN', // default
      })
    )
  ]
};

//
Why this is better than just a cookie
If you only used a standard session cookie, a hacker could trick a user into clicking a link that triggers a POST request to your API. 
The browser would automatically attach the session cookie, and the server would think it's legitimate.

By requiring the token to be in the header, the attack fails because browsers do not allow cross-origin requests to set custom headers unless the 
server explicitly allows it via CORS—and even then, the attacker can't read your XSRF-TOKEN cookie to know what value to put in that header.
*/

