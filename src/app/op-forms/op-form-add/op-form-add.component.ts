import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../shared/api.service';
import { AuthService } from '../../shared/auth.service';
import { Router } from '@angular/router';
import { Appointment } from '../../shared/models/appointment';
import { OPForm } from '../../shared/models/op-form';
import { Prescription } from '../../shared/models/prescription';
import { Invoice } from '../../shared/models/invoice';

@Component({
  selector: 'app-op-form-add',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    DatePipe,
  ],
  templateUrl: './op-form-add.component.html',
  styleUrls: ['./op-form-add.component.css'],
})
export class OpFormAddComponent implements OnInit {
  opForm: FormGroup;
  appointments: Appointment[] = [];
  prescriptions: Prescription[] = [];
  invoices: Invoice[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    public router: Router
  ) {
    this.opForm = this.fb.group({
      appointmentId: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      symptoms: ['', [Validators.required, Validators.maxLength(1000)]],
      diagnosis: ['', [Validators.required, Validators.maxLength(1000)]],
      treatment: ['', [Validators.required, Validators.maxLength(1000)]],
      remarks: ['', [Validators.maxLength(500)]],
      prescriptionId: ['', [Validators.pattern(/^\d+$/)]], // Optional, validate if selected
      invoiceId: ['', [Validators.pattern(/^\d+$/)]], // Optional, validate if selected
    });
  }

  ngOnInit(): void {
    this.loadAppointments();
    // Load prescriptions and invoices when appointmentId changes
    this.opForm.get('appointmentId')?.valueChanges.subscribe((appointmentId) => {
      if (appointmentId) {
        this.loadPrescriptions(Number(appointmentId));
        this.loadInvoices(Number(appointmentId));
      } else {
        this.prescriptions = [];
        this.invoices = [];
        this.opForm.patchValue({ prescriptionId: '', invoiceId: '' });
      }
    });
  }

  loadAppointments(): void {
    this.isLoading = true;
    const token = this.authService.getToken();
    if (!token) {
      this.isLoading = false;
      this.snackBar.open('Please log in to add an OP Form.', 'Close', { duration: 5000 });
      this.router.navigate(['/login']);
      return;
    }

    let email: string;
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      email = decodedToken.email || decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
      if (!email) {
        throw new Error('Email not found in token');
      }
    } catch (error) {
      this.isLoading = false;
      this.snackBar.open('Invalid token. Please log in again.', 'Close', { duration: 5000 });
      this.router.navigate(['/login']);
      return;
    }

    this.apiService.getAppointments(email).subscribe({
      next: (appointments) => {
        this.appointments = appointments;
        this.isLoading = false;
        if (appointments.length === 0) {
          this.snackBar.open('No appointments available to create an OP Form.', 'Close', { duration: 5000 });
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open(error.message || 'Failed to load appointments. Please try again.', 'Close', { duration: 5000 });
        console.error('Error fetching appointments', error);
      },
    });
  }

  loadPrescriptions(appointmentId: number): void {
    this.isLoading = true;
    this.apiService.getPrescriptionsByAppointment(appointmentId).subscribe({
      next: (prescriptions) => {
        this.prescriptions = prescriptions;
        this.isLoading = false;
        this.opForm.patchValue({ prescriptionId: '' }); // Reset selection
        if (prescriptions.length === 0) {
          this.snackBar.open('No prescriptions available for this appointment.', 'Close', { duration: 5000 });
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.prescriptions = [];
        this.opForm.patchValue({ prescriptionId: '' });
        this.snackBar.open(error.message || 'Failed to load prescriptions.', 'Close', { duration: 5000 });
        console.error('Error fetching prescriptions', error);
      },
    });
  }

  loadInvoices(appointmentId: number): void {
    this.isLoading = true;
    this.apiService.getInvoiceByAppointment(appointmentId).subscribe({
      next: (invoice) => {
        this.invoices = invoice ? [invoice] : [];
        this.isLoading = false;
        this.opForm.patchValue({ invoiceId: '' }); // Reset selection
        if (!invoice) {
          this.snackBar.open('No invoices available for this appointment.', 'Close', { duration: 5000 });
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.invoices = [];
        this.opForm.patchValue({ invoiceId: '' });
        this.snackBar.open(error.message || 'Failed to load invoices.', 'Close', { duration: 5000 });
        console.error('Error fetching invoices', error);
      },
    });
  }

  onSubmit(): void {
    if (this.opForm.invalid) {
      this.snackBar.open('Please fill in all required fields correctly.', 'Close', { duration: 5000 });
      this.opForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formValues = this.opForm.value;
    const opFormData: OPForm = {
      appointmentId: Number(formValues.appointmentId),
      symptoms: formValues.symptoms?.trim() || '',
      diagnosis: formValues.diagnosis?.trim() || '',
      treatment: formValues.treatment?.trim() || '',
      remarks: formValues.remarks?.trim() || null,
      prescriptionId: formValues.prescriptionId ? Number(formValues.prescriptionId) : null,
      invoiceId: formValues.invoiceId ? Number(formValues.invoiceId) : null,
      createdAt: new Date().toISOString(),
    };

    console.log('Submitting OP Form:', opFormData);

    this.apiService.createOPForm(opFormData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.snackBar.open(response.message || 'OP Form created successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/op-forms']);
      },
      error: (error) => {
        this.isLoading = false;
        let errorMessage = 'Failed to create OP Form. Please try again.';
        if (error.error?.errors) {
          errorMessage = Object.values(error.error.errors).flat().join(' ');
        } else if (error.message) {
          errorMessage = error.message;
        }
        this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
        console.error('Error creating OP form:', error);
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/op-forms']);
  }
}