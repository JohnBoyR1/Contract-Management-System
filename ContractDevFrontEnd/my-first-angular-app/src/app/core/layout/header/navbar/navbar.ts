import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AuthService } from '../../../auth/auth.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  isBurgerMenuVisible = false;

  authService = inject(AuthService);

  toggleBurgerMenu() {
    this.isBurgerMenuVisible = !this.isBurgerMenuVisible;
  }

  toggleSignInAndOut(){
    this.authService.logout();
  }

  ngOnInit() {
    if (this.authService.isLoggedIn ){
      
    }
  }
}
