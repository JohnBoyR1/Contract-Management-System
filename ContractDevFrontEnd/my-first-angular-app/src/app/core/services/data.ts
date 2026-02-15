import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  //mock Api for testing (the link for back end)
  private apiUrl = 'https://jsonplaceholder.typicode.com/users';

  constructor(private http: HttpClient) {}

  // sending data to backend (POST)
  sendData(payload: any): Observable<any> {
    return this.http.post(this.apiUrl, payload);
  }

  // recieving data from backend (GET)
  getData(): Observable<any> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
