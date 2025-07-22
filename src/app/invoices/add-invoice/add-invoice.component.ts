import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../shared/api.service';
import { AuthService } from '../../shared/auth.service';
import { Appointment } from '../../shared/models/appointment';

@Component({
  selector: 'app-add-invoice',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './add-invoice.component.html',
  styleUrls: ['./add-invoice.component.css'],
})
export class AddInvoiceComponent implements OnInit {
  invoiceForm: FormGroup;
  appointments: Appointment[] = [];
  errorMessage: string | null = null;
  successMessage: string | null = null;
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private authService: AuthService
  ) {
    this.invoiceForm = this.fb.group({
      appointmentId: ['', Validators.required],
      consultationFee: ['', [Validators.required, Validators.min(100), Validators.max(10000)]],
    });
  }

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const email = decodedToken.email;
        this.loadAppointments(email);
      } catch (error) {
        this.errorMessage = 'Invalid token. Please log in again.';
        console.error('Token parsing error:', error);
      }
    } else {
      this.errorMessage = 'Please log in to add an invoice.';
    }
  }

  private loadAppointments(email: string): void {
    this.apiService.getAppointments(email).subscribe({
      next: (appointments) => {
        this.appointments = appointments;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load appointments.';
        console.error('Error fetching appointments:', error);
      },
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.invoiceForm.valid) {
      const invoiceData = this.invoiceForm.value;
      this.apiService.createInvoice(invoiceData).subscribe({
        next: (invoice) => {
          this.successMessage = 'Invoice created successfully!';
          this.errorMessage = null;
          this.submitted = false;
          this.invoiceForm.reset();
        },
        error: (error) => {
          this.errorMessage = 'Failed to create invoice.';
          this.successMessage = null;
          console.error('Error creating invoice:', error);
        },
      });
    } else {
      this.errorMessage = 'Please fill out the form correctly.';
    }
  }
}