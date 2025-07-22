import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from '../../shared/api.service';
import { AuthService } from '../../shared/auth.service';
import { Appointment } from '../../shared/models/appointment';
import { Doctor } from '../../shared/models/doctor';
import { AppointmentEditDialogComponent } from '../appointment-edit-dialog/appointment-edit-dialog.component';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.css']
})
export class AppointmentListComponent implements OnInit {
  appointments: Appointment[] = [];
  filteredList: Appointment[] = [];
  doctorList: Doctor[] = [];
  displayedColumns: string[] = ['doctorName', 'patient', 'email', 'phone', 'date', 'time', 'status', 'actions'];

  searchText: string = '';
  selectedDoctorId: number | null = null;
  appointmentDate: string = '';

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
    this.loadDoctors();
  }

  loadAppointments(): void {
    const token = this.authService.getToken();
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const email = decodedToken.email;
      this.apiService.getAppointments(email).subscribe({
        next: (data) => {
          this.appointments = data;
          this.applyFilters(); // Filter initially
        },
        error: (error) => {
          console.error('Error fetching appointments', error);
          this.snackBar.open('Failed to load appointments.', 'Close', { duration: 3000 });
        }
      });
    }
  }

  loadDoctors(): void {
    this.apiService.getDoctors().subscribe({
      next: (data) => {
        this.doctorList = data;
      },
      error: (error) => {
        console.error('Error fetching doctors', error);
        this.snackBar.open('Failed to load doctors.', 'Close', { duration: 3000 });
      }
    });
  }

  editAppointment(appointment: Appointment): void {
    const dialogRef = this.dialog.open(AppointmentEditDialogComponent, {
      width: '500px',
      data: { ...appointment }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.updateAppointment(result).subscribe({
          next: () => {
            this.snackBar.open('Appointment updated successfully!', 'Close', { duration: 3000 });
            this.loadAppointments();
          },
          error: (error) => {
            console.error('Error updating appointment', error);
            this.snackBar.open('Failed to update appointment.', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  cancelAppointment(id: number): void {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      this.apiService.cancelAppointment(id).subscribe({
        next: () => {
          this.snackBar.open('Appointment cancelled successfully!', 'Close', { duration: 3000 });
          this.loadAppointments();
        },
        error: (error) => {
          console.error('Error cancelling appointment', error);
          this.snackBar.open('Failed to cancel appointment.', 'Close', { duration: 3000 });
        }
      });
    }
  }

  openBookingForm(): void {
    this.router.navigate(['/appointments/book']);
  }

  applyFilters(): void {
  this.filteredList = this.appointments.filter(a =>
    (!this.searchText || a.patientName?.toLowerCase().includes(this.searchText.toLowerCase())) &&
    (!this.selectedDoctorId || a.doctorId === +this.selectedDoctorId) &&
    (!this.appointmentDate || 
      this.formatDate(a.appointmentDate) === this.appointmentDate
    )
  );
}

// Add this helper method in the component:
formatDate(dateString: string | Date): string {
  const date = new Date(dateString);
  // Format as yyyy-MM-dd
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}


  resetFilters(): void {
    this.searchText = '';
    this.selectedDoctorId = null;
    this.appointmentDate = '';
    this.applyFilters();
  }

  get filteredAppointments(): Appointment[] {
    return this.filteredList;
  }
}
