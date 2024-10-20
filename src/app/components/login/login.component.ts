import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';  // <-- Import HttpClientModule here
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,  // For forms
    HttpClientModule,  // <-- Import HttpClientModule here for HTTP requests
    RouterModule
  ],
  providers: [
    AuthService  // Ensure AuthService is provided here if using standalone component
  ]
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService  // Inject AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
  
      this.authService.login(username, password).subscribe(
        response => {
          console.log('Login successful', response);
          this.router.navigate(['/stocks']);  // Redirect to stockComponent after login
        },
        error => {
          console.error('Login failed', error);
          alert('Invalid credentials. Please try again.');
        }
      );
    }
  }  
}
