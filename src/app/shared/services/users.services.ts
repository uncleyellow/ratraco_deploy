import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment} from '../environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.api.url}/download`; // URL từ environment

  constructor(private http: HttpClient) {}

  getUsers(): Observable<unknown[]> {
    const headers = new HttpHeaders({
      'Accept': 'text/plain'
    });

    return this.http.get<unknown[]>(this.apiUrl, { headers });
  }

  downloadAudio(videoUrl: string) {
    window.open(`${this.apiUrl}?url=${encodeURIComponent(videoUrl)}`, "_blank");
  }
}