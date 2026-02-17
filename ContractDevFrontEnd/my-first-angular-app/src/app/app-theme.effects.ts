// theme.effects.ts
// ----------------
// This file contains the global effect that syncs the <body> class
// with the current value of the darkMode signal.
//
// WHY THIS FILE EXISTS:
// - Effects run IMMEDIATELY when created.
// - If you put an effect inside a store file, it executes at import time,
//   BEFORE Angular's DI system is ready → causes NG0201, NG0203, NG0100.
// - By wrapping the effect in a function and calling it from main.ts,
//   we guarantee it runs inside a proper Angular injection context.


import { effect } from '@angular/core';
import { darkMode } from '../app-theme.store';

export function registerThemeEffect() {
    // This effect runs once at app startup and then re-runs
    // whenever darkMode() changes.
    effect(() => {
        const isDark = darkMode();
        document.body.classList.toggle('dark-mode', isDark);
        console.log("Effect running. darkMode =", darkMode());
    });
}
