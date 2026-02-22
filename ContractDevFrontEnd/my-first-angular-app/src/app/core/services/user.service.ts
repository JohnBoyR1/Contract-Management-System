/* This manages signup, login, getProfile by id, updateProfile by id and gets all profiles(to populate)*/
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import { SignupRequest } from '../models/signup-request.model';
import { LoginRequest } from '../models/login-request.model';
import { UserResponse } from '../models/user-response.model';
import { Profile } from '../models/profile.models';

// HttpClient lets Angular make HTTP requests (GET, POST, PUT, DELETE) to dotnet back end.
import { HttpClient } from '@angular/common/http';

// Injectable means this service can be used anywhere in your Angular app.
// Angular will create ONE shared instance of this service.
import { Injectable } from '@angular/core';




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
  signup(data: SignupRequest): Observable<UserResponse> {
    // POST sends data to the backend to create a new user.
    // Example final URL: http://localhost:5082/api/users/signup
    return this.http.post<UserResponse>(`${this.apiUrl}/UserAccounts/Register`, data);//post<UserResponse> expect backend end to return 
  }

  login(data: LoginRequest): Observable<any> {
    return this.http.post<UserResponse>(`${this.apiUrl}/UserAccounts/Login`, data);// back end must return user response
  }

  getProfile(id: number): Observable<Profile> {
    return this.http.get<Profile>(`${this.apiUrl}/UserProfiles/${id}`);// backend must return profile
  }

  // -----------------------------
  // UPDATE PROFILE REQUEST
  // -----------------------------
  // This method updates an existing user's profile.
  // 'id' is the user's ID in the database.
  // 'data' contains only the fields the user wants to update.
  updateProfile(id: number, data: FormData): Observable<void> {
    // PUT sends updated data to the backend.
    // Example final URL: http://localhost:5082/api/users/1
    return this.http.put<void>(`${this.apiUrl}/UserProfiles/${id}`, data);
  }

  //update the users password
  updateSecurity(id: number, payload: any) {
    return this.http.put(`/api/users/${id}/security`, payload);
  }




  //for the fun part calling all the profiles
  getAllProfiles(): Observable<Profile[]> {
    return this.http.get<Profile[]>(`${this.apiUrl}/UserProfiles`);// backend to return profile
  }
}
