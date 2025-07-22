import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../shared/api.service';
import { AuthService } from '../../shared/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    RouterModule,
  ],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false],
    });
  }

  ngOnInit(): void {
    if (this.route.snapshot.queryParams['registered']) {
      this.successMessage = 'Registration successful! Please log in.';
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
  if (this.loginForm.valid) {
    this.errorMessage = null;
    const { email, password, rememberMe } = this.loginForm.value;
    console.log('Submitting login request:', { email, password });
    this.apiService.login({ email, password }).subscribe({
      next: (response) => {
        console.log('Raw login response:', JSON.stringify(response));
        if (response.token) {
          this.authService.setToken(response.token, rememberMe);
          // Store email and username (assuming backend returns username or use email as fallback)
          const storage = rememberMe ? localStorage : sessionStorage;
          storage.setItem('email', email);
          storage.setItem('username', response.username || email.split('@')[0]);
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = response.message || 'Login failed: No token received';
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Login failed:', error);
        if (error.status === 401) {
          this.errorMessage = 'Invalid email or password';
        } else if (error.status === 0) {
          this.errorMessage =
            'Unable to connect to the server. Ensure the server is running on https://localhost:44321 and your browser trusts the SSL certificate.';
        } else {
          this.errorMessage = 'Login failed: ' + (error.error?.message || 'Invalid Email or Password');
        }
      },
    });
  } else {
    this.errorMessage = 'Please fill out the form correctly';
  }
}
}