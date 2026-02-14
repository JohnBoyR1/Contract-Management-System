import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {

  constructor(public router: Router) {}
  //when login page is selected (results in True)
  get isLoginPage(): boolean {
  return this.router.url === '/login';
}

  
}


