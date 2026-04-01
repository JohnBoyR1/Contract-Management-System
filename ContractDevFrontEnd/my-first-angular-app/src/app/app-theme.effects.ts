
//global theme effects for application in this case dark mode

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
