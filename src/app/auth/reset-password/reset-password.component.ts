import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../shared/api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterModule
  ]
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  email: string | null = null;
  token: string | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6), Validators.pattern('^(?=.*[A-Z])(?=.*[\\W_]).+$')]],
      confirmPassword: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      token: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
      this.token = params['token'] || '';
      this.resetPasswordForm.patchValue({ email: this.email, token: this.token });
    });
  }

  passwordMatchValidator(form: FormGroup): void {
    const password = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ mismatch: true });
    } else {
      form.get('confirmPassword')?.setErrors(null);
    }
  }

  togglePasswordVisibility(field: 'newPassword' | 'confirmPassword'): void {
    if (field === 'newPassword') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid) {
      this.errorMessage = null;
      this.successMessage = null;
      const { email, token, newPassword, confirmPassword } = this.resetPasswordForm.value;
      this.apiService.resetPassword({ email, token, newPassword, confirmPassword }).subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.successMessage = 'Password reset successfully. Please log in.';
            setTimeout(() => this.router.navigate(['/login']), 2000);
          } else {
            this.errorMessage = response.message || 'Failed to reset password.';
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('Reset password failed:', error);
          if (error.status === 400) {
            this.errorMessage = 'Invalid token or request.';
          } else if (error.status === 0) {
            this.errorMessage = 'Unable to connect to the server. Ensure the server is running on https://localhost:44321 and your browser trusts the SSL certificate.';
          } else {
            this.errorMessage = 'Failed to reset password: ' + (error.error?.message || 'Server error');
          }
        }
      });
    } else {
      this.errorMessage = 'Please fill out the form correctly.';
    }
  }
}