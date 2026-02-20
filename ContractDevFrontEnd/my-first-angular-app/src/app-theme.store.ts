// app-theme.store.ts
// ------------------
// This file defines your global theme state using Angular signals.
// IMPORTANT: A store file should contain ONLY state, not side effects.
// Effects must run inside an injection context (e.g., main.ts or AppComponent).

import { signal } from '@angular/core';

// 1. Global writable signal

// A global signal representing whether dark mode is enabled.
// This is a pure reactive value — no DI, no side effects.
export const darkMode = signal(
  JSON.parse(localStorage.getItem('darkMode') ?? 'false')//(?? because the first load is null).   
);

