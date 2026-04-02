/* 
  UserService
  -----------
  Handles all user‑related HTTP operations:
  - Signup
  - Login
  - Get profile by ID
  - Update profile
  - Upload profile image
  - Update password
  - Account recovery
  - Get all profiles (gallery)
  - Delete user account
*/

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
  providedIn: 'root',
})
export class UserService {
  // This is the base URL of your .NET API.
  // All user-related endpoints start with /api/users
  private apiUrl = `${environment.apiUrl}/api`;

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
    return this.http.post<void>(`${this.apiUrl}/UserAccounts/Register`, data); //post<UserResponse> expect backend end to return
  }
  
  // ----------------------------------------------------
  // LOGIN
  // ----------------------------------------------------
  // Sends login credentials to the backend.
  // Backend should return a token or user object.
  login(data: FormData): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/UserAccounts/Login`, data); // back end must return user response
  }

  // ----------------------------------------------------
  // GET PROFILE BY ID
  // ----------------------------------------------------
  // Retrieves a user's profile using a query parameter (?id=123).
  getProfile(id: number): Observable<Profile> {
    //return this.http.get<Profile>(`${this.apiUrl}/UserProfiles/ProfileDetails?id=${id}`); // ?id=${id} form query
    return this.http.get<Profile>(`${this.apiUrl}/UserProfiles/ProfileDetails`, { params: { id } });
  }

  // -----------------------------
  // UPDATE PROFILE REQUEST
  // -----------------------------
  // This method updates an existing user's profile.
  // 'id' is the user's ID in the database.
  // 'data' contains only the fields the user wants to update.
  updateProfile(data: FormData): Observable<void> {
    // PUT sends updated data to the backend.
    return this.http.put<void>(`${this.apiUrl}/UserProfiles/UpdateProfile`, data);
  }

  // ----------------------------------------------------
  // UPLOAD PROFILE IMAGE / FILE
  // ----------------------------------------------------
  // Dedicated endpoint for uploading files (e.g., profile picture).
  uploadFile(data: FormData): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/UserProfiles/UploadFile`, data);
  }

   // ----------------------------------------------------
  // UPDATE PASSWORD
  // ----------------------------------------------------
  // Sends old + new password to backend for validation and update.
  updateSecurity(data: FormData): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/UserAccounts/ChangePassword`, data);
  }

  // ----------------------------------------------------
  // ACCOUNT RECOVERY
  // ----------------------------------------------------
  // Sends recovery email, security question, security answer, new password to backend.
  accountRecovery(data: FormData): Observable<string> {
    return this.http.post(`${this.apiUrl}/UserAccounts/RecoverAccount`, data, {
      responseType: 'text', // Ensures Angular does NOT try to parse JSON
    }); 
  }

  // ----------------------------------------------------
  // GET ALL PROFILES (GALLERY)
  // ----------------------------------------------------
  // Retrieves all user profiles for gallery display.
  getAllProfiles(): Observable<Profile[]> {
    return this.http.get<Profile[]>(`${this.apiUrl}/UserProfiles/ProfileGallery`); // backend to return profile
  }

  // ----------------------------------------------------
  // DELETE USER ACCOUNT
  // ----------------------------------------------------
  deleteUserAccount(data: FormData): Observable<void> {
    return this.http.request<void>('Delete', `${this.apiUrl}/UserAccounts/Delete`, {
      body: data,
      responseType: 'json',
    });
  }

  // ----------------------------------------------------
  // updateRating (GALLERY)
  // ----------------------------------------------------
  // Updates the other users ratings
  addRating(data: FormData): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/UserRatings/AddRating`, data);
  }

  // ----------------------------------------------------
  // getUserRating (GALLERY)
  // ----------------------------------------------------
  // gets the other users ratings
  getUserRating(reviewerId: number, revieweeId: number) {
    return this.http.get<any>(
      `${environment.apiUrl}/UserRatings/GetUserRating?reviewerId=${reviewerId}&revieweeId=${revieweeId}`
    );
  }


  // ----------------------------------------------------
  // removeRating (GALLERY)
  // ----------------------------------------------------
  // removes your rating from another user
  removeRating(data: FormData): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/UserRatings/RemoveReview`, {
      body: data,
    });
  }

}
