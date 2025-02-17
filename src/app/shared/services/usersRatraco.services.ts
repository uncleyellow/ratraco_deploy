import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment} from '../environment';
@Injectable({
  providedIn: 'root',
})
export class UsersRatracoService {
  private apiUrl = `${environment.api.url}`; // URL từ environment
 
  constructor(private http: HttpClient) {}

  getSheetData(id): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
