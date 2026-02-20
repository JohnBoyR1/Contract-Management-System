// main.ts
// -------
// This is the root entry point of your Angular application.
// We register the theme effect INSIDE Angular's injection context
// using provideAppInitializer + inject(EnvironmentInjector).
// This ensures:
// - The effect runs AFTER Angular bootstraps
// - It runs inside a valid injection context
// - It avoids NG0203 and all DI timing issues

import { bootstrapApplication } from '@angular/platform-browser';
import { provideAppInitializer, inject, runInInjectionContext, EnvironmentInjector } from '@angular/core';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { registerThemeEffect } from './app/app-theme.effects';

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...(appConfig.providers ?? []),

    // App initializers run after the root injector is created.
    provideAppInitializer(() => {
      // Correct way to access the root injector in Angular 17+
      const injector = inject(EnvironmentInjector);

      // Run the theme effect inside Angular's DI context.
      runInInjectionContext(injector, () => {
        registerThemeEffect();
      });
    })
  ]
})
.catch((err) => console.error(err));