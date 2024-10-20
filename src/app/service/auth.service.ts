import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api';  // Update with your backend API URL

  constructor(private http: HttpClient) {}

  // Login method that sends a POST request to the backend
  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password }, { headers })
      .pipe(
        tap(response => {
          // Store the JWT in local storage
          localStorage.setItem('authToken', response.jwt);  // Make sure 'jwt' matches your backend's response key
        })
      );
  }

  // Logout method to clear JWT from localStorage
  logout(): void {
    localStorage.removeItem('authToken');
  }

  // Get the JWT token from local storage
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Check if the user is logged in
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
