/* This manages signup, login, getProfile by id, updateProfile by id and gets all profiles(to populate)*/

// HttpClient lets Angular make HTTP requests (GET, POST, PUT, DELETE)
// to your .NET backend API.
import { HttpClient } from '@angular/common/http';

// Injectable means this service can be used anywhere in your Angular app.
// Angular will create ONE shared instance of this service.
import { Injectable } from '@angular/core';

// Observable represents a value that will come back in the future.
// HTTP requests are asynchronous, so they return Observables.
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  // 'root' means this service is available everywhere in the app
  // without needing to manually add it to providers[].
  providedIn: 'root',
})
export class UserService {
  // This is the base URL of your .NET API.
  // All user-related endpoints start with /api/users
  private apiUrl = `${environment.apiUrl}/api`;
  //private apiUrl = `${environment.apiUrl}/api/users`

  // HttpClient is injected into the service so we can make HTTP calls.
  constructor(private http: HttpClient) {}

  // -----------------------------
  // SIGNUP REQUEST
  // -----------------------------
  // This method sends the signup form data to your backend.
  // 'data' is the object containing firstName, lastName, email, etc.
  // It returns an Observable, meaning the component must subscribe to it.
  signup(data: any): Observable<any> {
    // POST sends data to the backend to create a new user.
    // Example final URL: http://localhost:5082/api/users/signup
    return this.http.post(`${this.apiUrl}/UserAccounts/Register`, data);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/UserAccounts/Login`, { email, password });
  }

  getProfile(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/UserProfiles/${id}`);
  }

  // -----------------------------
  // UPDATE PROFILE REQUEST
  // -----------------------------
  // This method updates an existing user's profile.
  // 'id' is the user's ID in the database.
  // 'data' contains only the fields the user wants to update.
  updateProfile(id: number, data: any): Observable<any> {
    // PUT sends updated data to the backend.
    // Example final URL: http://localhost:5082/api/users/1
    return this.http.put(`${this.apiUrl}/UserProfiles/${id}`, data);
  }

  //for the fun part calling all the profiles
  getAllProfiles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/UserProfiles`);
  }
}
