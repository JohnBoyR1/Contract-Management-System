
import { Injectable, signal } from '@angular/core';

// UI settings 
@Injectable({ providedIn: 'root' })
export class UiStateService {
  activeNav = signal<boolean | null>(null);//set in navbar.ts

  // used for Navbar searching profiles filter (gallery-page)
  searchTerm = signal<string>('');
  isSearching = signal<boolean>(false);
  // search bar (only shows in gallery-page)
  showSearchBar = signal(false);

}
