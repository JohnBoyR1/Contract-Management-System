import { Component, HostListener, ElementRef, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AuthService } from '../../../auth/auth.service';
import { darkMode } from '../../../../../app-theme.store';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UiStateService } from '../../../services/ui-state.service';


@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, MatTooltipModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  //searching 
  uiService = inject(UiStateService);

  onSearch(value: string){
    
    this.uiService.searchTerm.set(value);
    console.log("SEARCH FIRED", value);
    this.uiService.isSearching.set(value.length > 0);

  }

  //check if burger menu is expanded
  isBurgerMenuOpen = false;

  constructor(private referenceElement: ElementRef, public authService: AuthService){}

  /*Listen for clicks inside the browser*/
  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    // checking if click event is inside the navbar component
    const clickedInside = this.referenceElement.nativeElement.contains(event.target);
    
    
    // If the click was outside the navbar AND the burger menu is expanded (showing)
    if (!clickedInside && this.isBurgerMenuOpen) {
      this.isBurgerMenuOpen = false;
    }
  }
  //imported darkMode (access)
  darkMode = darkMode;
  /*toggle switch next to the search placeholder*/
  toggleDarkMode(){
     const valueChange = !this.darkMode();//toggle works with flipped values (not only run when true)
     this.darkMode.set(valueChange);
     localStorage.setItem('darkMode', JSON.stringify(valueChange));
  }
  /*sign out/ logout button*/
  toggleSignInAndOut() {
    this.authService.logout();
  }
}