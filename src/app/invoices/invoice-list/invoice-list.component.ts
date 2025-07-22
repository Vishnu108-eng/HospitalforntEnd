import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../shared/api.service';
import { AuthService } from '../../shared/auth.service';
import { Router } from '@angular/router';
import { Appointment } from '../../shared/models/appointment';
import { Doctor } from '../../shared/models/doctor';

export interface Invoice {
  id: number;
  appointmentId: number;
  consultationFee: number;
  pdfPath: string;
  createdAt: string;
  patientName?: string; // Added for display purposes
  doctorName?: string; // Added for display purposes
}

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
  ],
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css'],
})
export class InvoiceListComponent implements OnInit {
  invoices: Invoice[] = [];
  displayedColumns: string[] = ['patient', 'doctor', 'date', 'amount', 'pdf'];
  errorMessage: string | null = null;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const email = decodedToken.email;
        this.loadInvoices(email);
      } catch (error) {
        this.errorMessage = 'Invalid token. Please log in again.';
        console.error('Token parsing error:', error);
      }
    } else {
      this.errorMessage = 'Please log in to view invoices.';
    }
  }

  private loadInvoices(email: string): void {
    this.apiService.getAppointments(email).subscribe({
      next: (appointments: Appointment[]) => {
        this.invoices = [];
        appointments.forEach((appointment) => {
          this.apiService.getInvoiceByAppointment(appointment.id).subscribe({
            next: (invoice: Invoice) => {
              if (invoice) {
                // Enrich invoice with patient and doctor names
                const enrichedInvoice: Invoice = {
                  ...invoice,
                  patientName: appointment.patientName,
                  doctorName: appointment.doctor?.fullName || 'Unknown Doctor',
                };
                this.invoices = [...this.invoices, enrichedInvoice];
              }
            },
            error: (error) => {
              console.error('Error fetching invoice for appointment', appointment.id, error);
            },
          });
        });
      },
      error: (error) => {
        this.errorMessage = 'Failed to load appointments.';
        console.error('Error fetching appointments:', error);
      },
    });
  }

  downloadInvoice(id: number): void {
    this.apiService.downloadInvoice(id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Invoice_${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        this.errorMessage = 'Failed to download invoice.';
        console.error('Error downloading invoice:', error);
      },
    });
  }

  navigateToAddInvoice(): void {
    this.router.navigate(['/invoices/add']);
  }
}