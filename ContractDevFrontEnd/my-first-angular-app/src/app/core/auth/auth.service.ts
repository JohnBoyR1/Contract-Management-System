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
  // Tracks whether the user is authenticated.
  // Automatically updates UI components that depend on login state.
  isLoggedIn = signal(!!localStorage.getItem('auth_token'));

  // Key used to store the JWT token in localStorage
  private readonly TOKEN_KEY = 'auth_token';

  constructor(
    private http: HttpClient,
    private router: Router,
    private profileStateService: ProfileStateService
  ) {}

  /*
    Sends login credentials to the backend.
    Expects a JWT token in the response body.
    Stores the token in localStorage.
    Updates the login signal so the UI reacts instantly.
  */
  login(formData: FormData): Observable<HttpResponse<{ token: string }>> {
  return this.http
    .post<{ token: string }>(
      `${environment.apiUrl}/api/UserAccounts/Login`,
      formData,
      { observe: 'response' } // allows reading headers and the full response
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
  /*
    Removes the JWT token.
    Updates login signal.
    Clears the user's profile state.
    Redirects to login page.
    Used when user manually logs out OR token becomes invalid.
  */
  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.isLoggedIn.set(false); // signal update
    this.profileStateService.clearProfile();
    this.router.navigate(['/login']);
  }

  /*
    Returns the stored JWT token.
    Used by the authInterceptor to attach Authorization headers.
  */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /*
    Decodes the JWT token to extract the user ID (stored in "sub").
    Returns null if token is missing or invalid.
    Used by the authGuard to load the user's profile.
  */
  getCurrentUserId(): number | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      return Number(decoded.sub);
    } catch {
      //If Token is corrupted or expired
      localStorage.removeItem(this.TOKEN_KEY);
      return null;
    }
  }

  /*
    Endpoint to check if the token is still valid.
    Useful for session restoration or silent authentication.
  */
  validateToken() {
    return this.http.get(`${environment.apiUrl}/api/UserAccounts/Validate`);
  }
}





