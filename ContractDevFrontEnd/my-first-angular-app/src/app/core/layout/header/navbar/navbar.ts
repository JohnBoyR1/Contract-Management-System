import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AuthService } from '../../../auth/auth.service';
import { darkMode } from '../../../../../app-theme.store';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, MatTooltipModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  authService = inject(AuthService);
  darkMode = darkMode;

  toggleDarkMode(){
     const valueChange = !this.darkMode();//toggle works with flipped values (not only run when true)
     this.darkMode.set(valueChange);
     localStorage.setItem('darkMode', JSON.stringify(valueChange));
  }

  toggleSignInAndOut() {
    this.authService.logout();
  }
}