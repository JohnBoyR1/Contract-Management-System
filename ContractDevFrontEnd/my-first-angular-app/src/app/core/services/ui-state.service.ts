import { Injectable, signal } from '@angular/core';

// Global
@Injectable({ providedIn: 'root' })
export class UiStateService {
  activeNav = signal<boolean | null>(null);//set in navbar.ts

  // Add these
  searchTerm = signal<string>('');
  isSearching = signal<boolean>(false);

  // search bar
  showSearchBar = signal(false);

}
