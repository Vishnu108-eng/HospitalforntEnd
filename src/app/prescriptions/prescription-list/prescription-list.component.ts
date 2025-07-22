import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../shared/api.service';
import { AuthService } from '../../shared/auth.service';
import { Prescription } from '../../shared/models/prescription';
import { Appointment } from '../../shared/models/appointment';

@Component({
  selector: 'app-prescription-list',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './prescription-list.component.html',
  styleUrls: ['./prescription-list.component.css'],
})
export class PrescriptionListComponent implements OnInit {
  prescriptions: (Prescription & { patientName?: string; doctorName?: string })[] = [];
  displayedColumns: string[] = ['patient', 'doctor', 'date', 'pdf'];

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPrescriptions();
  }

  loadPrescriptions(): void {
    const token = this.authService.getToken();
    if (!token) {
      alert('Please log in to view prescriptions.');
      return;
    }

    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const email = decodedToken.email;

      // Fetch appointments for the user
      this.apiService.getAppointments(email).subscribe({
        next: (appointments: Appointment[]) => {
          this.prescriptions = [];
          // For each appointment, fetch prescriptions
          appointments.forEach((appointment) => {
            this.apiService.getPrescriptionsByAppointment(appointment.id).subscribe({
              next: (prescriptions: Prescription[]) => {
                const enrichedPrescriptions = prescriptions.map((prescription) => ({
                  ...prescription,
                  patientName: appointment.patientName,
                  doctorName: appointment.doctor?.fullName || 'Unknown Doctor',
                }));
                this.prescriptions = [...this.prescriptions, ...enrichedPrescriptions];
              },
              error: (error: any) => {
                console.error(`Error loading prescriptions for appointment ${appointment.id}:`, error);
              },
            });
          });
        },
        error: (error: any) => {
          alert(error.message || 'Error loading appointments.');
        },
      });
    } catch (error) {
      alert('Invalid token. Please log in again.');
      console.error('Token parsing error:', error);
    }
  }

  downloadPrescription(id: number): void {
    this.apiService.downloadPrescription(id).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `prescription_${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (error: any) => {
        alert(error.message || 'Error downloading prescription.');
      },
    });
  }

  navigateToAddPrescription(): void {
    this.router.navigate(['/prescriptions/add']);
  }
}