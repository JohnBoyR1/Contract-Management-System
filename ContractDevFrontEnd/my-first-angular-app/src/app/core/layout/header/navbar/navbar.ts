import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AuthService } from '../../../auth/auth.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Navbar {

  authService = inject(AuthService);

  isBurgerMenuVisible = false;

  toggleBurgerMenu() {
    this.isBurgerMenuVisible = !this.isBurgerMenuVisible;
  }

  toggleSignInAndOut() {
    this.authService.logout();
  }
}
