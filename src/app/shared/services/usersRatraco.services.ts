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

  addUser(userData: any): Observable<any> {
    debugger
    return this.http.post(`${this.apiUrl}/api/users`, {
      userName: userData.userName,
      passWord: userData.password,
      address: userData.address,
      phoneNumbers: userData.phoneNumber,
      role: userData.role,
      creatBy: 'admin' // Có thể thay đổi tùy theo logic của bạn
    });
  }
}
