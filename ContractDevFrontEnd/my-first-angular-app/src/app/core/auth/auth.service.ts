import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { ProfileStateService } from '../services/profile-state.service';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class AuthService {

  // SIGNAL replaces BehaviorSubject + boolean
  isLoggedIn = signal(!!localStorage.getItem('auth_token'));

  private readonly TOKEN_KEY = 'auth_token';

  constructor(
    private http: HttpClient,
    private router: Router,
    private profileStateService: ProfileStateService
  ) {}

  login(formData: FormData): Observable<HttpResponse<{ token: string }>> {
  return this.http
    .post<{ token: string }>(
      `${environment.apiUrl}/api/UserAccounts/Login`,
      formData,
      { observe: 'response' }
    )
    .pipe(
      tap((res) => {
        const token = res.body?.token;
        if (token) {
          localStorage.setItem(this.TOKEN_KEY, token);
          this.isLoggedIn.set(true);
        }
      })
    );
}


  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.isLoggedIn.set(false); // signal update
    this.profileStateService.clearProfile();
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUserId(): number | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      return Number(decoded.sub);
    } catch {
      localStorage.removeItem(this.TOKEN_KEY);
      return null;
    }
  }

  validateToken() {
    return this.http.get(`${environment.apiUrl}/api/UserAccounts/Validate`);
  }
}








/*import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { ProfileStateService } from '../shared/profile-state.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  isLoggedIn = false;

  private http = inject(HttpClient);
  private router = inject(Router);
  private profileStateService = inject(ProfileStateService);

  private readonly TOKEN_KEY = 'auth_token';

  // BehaviorSubject initialized based on whether a token exists in storage
  private loggedIn = new BehaviorSubject<boolean>(!!localStorage.getItem(this.TOKEN_KEY));
  isLoggedIn$ = this.loggedIn.asObservable();

  //LOGIN calls backend , receives { token }, stores it
  login(credentials: any) {
    // Replace with your actual API URL
    return this.http
      .post<{ token: string }>(`${environment.apiUrl}/api/UserAccounts/Login`, credentials)
      .pipe(
        tap((res) => {
          // saves token to local storage
          localStorage.setItem(this.TOKEN_KEY, res.token);

          this.isLoggedIn = true;

          //update login state
          this.loggedIn.next(true);
        }),
      );
  }

  // LOGOUT - clears token and redirects
  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
    this.isLoggedIn = false;
    this.profileStateService.clearProfile();
  }

  // GET TOKEN  used by the interceptor
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Get current userId

  getCurrentUserId(): number | null {
    //decoding the token
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) return null;
    try {
      const decoded: any = jwtDecode(token);
      return Number(decoded.sub); // "sub" contains the userId
    } catch (e) {
      console.error('Invalid JWT in localStorage');
      localStorage.removeItem('auth_token');
      return null;
    }
  }
  //this is for validation of the already given token
  validateToken() {
    return this.http.get(`${environment.apiUrl}/api/UserAccounts/Validate`);
  }
}*/
