import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://localhost:44347/api/Users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<unknown[]> {
    const headers = new HttpHeaders({
      'Accept': 'text/plain'
    });

    return this.http.get<unknown[]>(this.apiUrl, { headers });
  }
}