import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../shared/api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule
  ]
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.errorMessage = null;
      this.successMessage = null;
      const { email } = this.forgotPasswordForm.value;
      this.apiService.forgotPassword({ email }).subscribe({
        next: (response) => {
          if (response.token) {
            this.successMessage = 'A reset token has been sent to your email.';
            // Optionally, redirect to reset password page with token
            this.router.navigate(['/reset-password'], { queryParams: { email, token: response.token } });
          } else {
            this.errorMessage = response.message || 'Failed to send reset token.';
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('Forgot password failed:', error);
          if (error.status === 404) {
            this.errorMessage = 'Email not found.';
          } else if (error.status === 0) {
            this.errorMessage = 'Unable to connect to the server. Ensure the server is running on https://localhost:44321 and your browser trusts the SSL certificate.';
          } else {
            this.errorMessage = 'Failed to send reset token: ' + (error.error?.message || 'Server error');
          }
        }
      });
    } else {
      this.errorMessage = 'Please enter a valid email address.';
    }
  }
}