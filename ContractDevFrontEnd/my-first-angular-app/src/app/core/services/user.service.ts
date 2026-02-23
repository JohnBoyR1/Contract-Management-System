/* This manages signup, login, getProfile by id, updateProfile by id and gets all profiles(to populate)*/
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

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
  signup(data: FormData): Observable<void> {
    // POST sends data to the backend to create a new user.
    // Example final URL: http://localhost:5082/api/users/signup
    return this.http.post<void>(`${this.apiUrl}/UserAccounts/Register`, data); //post<UserResponse> expect backend end to return
  }

  login(data: FormData): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/UserAccounts/Login`, data); // back end must return user response
  }

  getProfile(id: number): Observable<Profile> {
    return this.http.get<Profile>(`${this.apiUrl}/UserProfiles/ProfileDetails?id=${id}`); // ?id=${id} form query
  }

  // -----------------------------
  // UPDATE PROFILE REQUEST
  // -----------------------------
  // This method updates an existing user's profile.
  // 'id' is the user's ID in the database.
  // 'data' contains only the fields the user wants to update.
  updateProfile(data: FormData): Observable<void> {
    // PUT sends updated data to the backend.
    // Example final URL: http://localhost:5082/api/users/1
    return this.http.put<void>(`${this.apiUrl}/UserProfiles/UpdateProfile`, data);
    //return this.http.put<void>(`${this.apiUrl}/UserProfiles/${id}`, data);
  }
  //upload file
  uploadFile(data: FormData): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/UserProfiles/UploadFile`, data);
  }

  //update the users password
  updateSecurity(data: FormData): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/UserProfiles/UpdateProfile`, data);
  }

  //for the fun part calling all the profiles
  getAllProfiles(): Observable<Profile[]> {
    return this.http.get<Profile[]>(`${this.apiUrl}/UserProfiles/ProfileGallery`); // backend to return profile
  }

  //delete profile
  deleteUserAccount(data: FormData): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/UserAccounts/Delete`, data);
  }
}
