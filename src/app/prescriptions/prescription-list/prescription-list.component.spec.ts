import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../shared/api.service';
import { AuthService } from '../../shared/auth.service';
import { Prescription } from '../../shared/models/prescription';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-prescription-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule
  ],
  templateUrl: './prescription-list.component.html',
  styleUrls: ['./prescription-list.component.css']
})
export class PrescriptionListComponent implements OnInit {
  prescriptions: Prescription[] = [];
  displayedColumns: string[] = ['id', 'appointmentId', 'medication', 'instructions', 'createdAt', 'actions'];
  appointmentId: number | null = null;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get appointmentId from route query params or other dynamic source
    this.route.queryParams.subscribe(params => {
      this.appointmentId = params['appointmentId'] ? +params['appointmentId'] : null;
      if (this.appointmentId) {
        this.loadPrescriptions(this.appointmentId);
      } else {
        alert('No appointment ID provided. Please select an appointment.');
      }
    });
  }

  loadPrescriptions(appointmentId: number): void {
    this.apiService.getPrescriptionsByAppointment(appointmentId).subscribe({
      next: (data: Prescription[]) => {
        this.prescriptions = data;
      },
      error: (error) => {
        console.error('Error loading prescriptions:', error);
        alert(`Failed to load prescriptions: ${error.message}`);
      }
    });
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
      error: (error) => {
        console.error('Error downloading prescription:', error);
        alert(`Failed to download prescription: ${error.message}`);
      }
    });
  }
}