import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../shared/api.service';
import { AuthService } from '../../shared/auth.service';
import { OPForm } from '../../shared/models/op-form';
import { Router } from '@angular/router';

@Component({
  selector: 'app-op-form-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatSnackBarModule,
    DatePipe,
  ],
  templateUrl: './op-form-list.component.html',
  styleUrls: ['./op-form-list.component.css'],
})
export class OpFormListComponent implements OnInit {
  opForms: OPForm[] = [];
  displayedColumns: string[] = [
    'patient',
    'doctor',
    'date',
    'symptoms',
    'diagnosis',
    'treatment',
    'prescription',
    'invoice',
    'pdf',
  ];
  isLoading = true;
  errorMessage: string = '';

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOPForms();
  }

  loadOPForms(): void {
    this.isLoading = true;
    this.errorMessage = '';
    const token = this.authService.getToken();
    if (!token) {
      this.errorMessage = 'Please log in to view OP Forms.';
      this.isLoading = false;
      this.snackBar.open(this.errorMessage, 'Close', { duration: 5000 });
      return;
    }

    this.apiService.getAllOPForms().subscribe({
      next: (opForms) => {
        this.opForms = opForms;
        this.isLoading = false;
        if (opForms.length === 0) {
          this.errorMessage = 'No OP Forms found.';
          this.snackBar.open(this.errorMessage, 'Close', { duration: 5000 });
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Failed to load OP Forms. Please try again.';
        this.snackBar.open(this.errorMessage, 'Close', { duration: 5000 });
        console.error('Error fetching OP forms', error);
      },
    });
  }

  downloadOPForm(id: number): void {
    this.apiService.downloadOPForm(id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `OPForm_${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.snackBar.open('OP Form downloaded successfully', 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error downloading OP form', error);
        this.errorMessage = error.message || 'Failed to download OP Form';
        this.snackBar.open(this.errorMessage, 'Close', { duration: 5000 });
      },
    });
  }

  downloadPrescription(id: number): void {
    this.apiService.downloadPrescription(id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Prescription_${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.snackBar.open('Prescription downloaded successfully', 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error downloading prescription', error);
        this.errorMessage = error.message || 'Failed to download Prescription';
        this.snackBar.open(this.errorMessage, 'Close', { duration: 5000 });
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
        this.snackBar.open('Invoice downloaded successfully', 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error downloading invoice', error);
        this.errorMessage = error.message || 'Failed to download Invoice';
        this.snackBar.open(this.errorMessage, 'Close', { duration: 5000 });
      },
    });
  }

  trackByOpFormId(index: number, item: OPForm): number {
    return item.id || index;
  }

  navigateToAddOPForm(): void {
    this.router.navigate(['/op-forms/add']);
  }
}