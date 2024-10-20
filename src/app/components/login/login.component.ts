import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    const loginData = { username: this.username, password: this.password };

    this.http.post<any>('api/login', loginData).subscribe({
      next: (response) => {
        // Store JWT in localStorage
        localStorage.setItem('jwt', response.jwt);

        // Redirect to the stocks page
        this.router.navigate(['/stocks']);
      },
      error: (error) => {
        this.errorMessage = 'Login failed. Please try again.';
      }
    });
  }
}
