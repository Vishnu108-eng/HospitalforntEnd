import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../shared/api.service';
import { DashboardViewModel } from '../../shared/models/dashboard-view-model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  dashboardData: DashboardViewModel | null = null;
  errorMessage: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    console.log('DashboardComponent: Initializing...');
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    console.log('DashboardComponent: Fetching dashboard data from API...');
    this.apiService.getDashboardData().subscribe({
      next: (data) => {
        console.log('DashboardComponent: Data received:', data);
        this.dashboardData = data;
      },
      error: (error: HttpErrorResponse) => {
        console.error('DashboardComponent: Error fetching dashboard data:', error);
        if (error.status === 0) {
          this.errorMessage = 'Unable to connect to the server. Please ensure the backend is running at https://localhost:44321.';
        } else if (error.status === 401) {
          this.errorMessage = 'Unauthorized: Please log in again.';
        } else {
          this.errorMessage = `Failed to load dashboard data: ${error.message || 'Unknown error'}`;
        }
      },
      complete: () => {
        console.log('DashboardComponent: API call completed.');
      }
    });
  }

  getStyle(type: string): string {
    switch (type) {
      case 'doctors': return 'bg-primary';
      case 'patients': return 'bg-success';
      case 'appointments': return 'bg-warning';
      case 'pendingAppointments': return 'bg-info';
      case 'completedAppointments': return 'bg-secondary';
      case 'prescriptions': return 'bg-danger';
      case 'invoices': return 'bg-dark';
      case 'opforms': return 'bg-primary';
      default: return 'bg-secondary';
    }
  }
}
