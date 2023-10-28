import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
 
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8000';
 
  constructor(private http: HttpClient) { }
 
  getAllUsers() {
    return this.http.get(`${this.apiUrl}/allUsers`);
  }
 
  getUser(userId: string) {
    return this.http.get(`${this.apiUrl}/allUsers/${userId}`);
  }
 
  addUser(user: any) {
    return this.http.post(`${this.apiUrl}/addUsers`, user);
  }
}