import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ApiService } from '../../shared/api.service';
import { AuthService } from '../../shared/auth.service';
import { Doctor } from '../../shared/models/doctor';

@Component({
  selector: 'app-doctor-list',
  templateUrl: './doctor-list.component.html',
  styleUrls: ['./doctor-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class DoctorListComponent implements OnInit {
  doctors: Doctor[] = [];
  displayedColumns: string[] = ['fullName', 'specialization', 'email', 'phoneNumber', 'gender', 'isAvailable', 'actions'];
  errorMessage: string | null = null;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('DoctorListComponent initialized');
    if (!this.authService.isLoggedIn()) {
      console.warn('User not logged in, redirecting to login');
      this.router.navigate(['/login']);
      return;
    }
    this.loadDoctors();
  }

  loadDoctors(): void {
    console.log('Fetching doctors from API');
    this.apiService.getDoctors().subscribe({
      next: (data) => {
        console.log('Doctors fetched successfully:', data);
        this.doctors = data;
        this.errorMessage = null;
      },
      error: (error) => {
        console.error('Error fetching doctors:', error);
        this.errorMessage = error.status === 401
          ? 'Unauthorized: Please log in again'
          : 'Failed to load doctors. Please try again later.';
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      }
    });
  }

  addDoctor(): void {
    this.router.navigate(['/doctors/add']);
  }

  editDoctor(id: number): void {
    this.router.navigate([`/doctors/edit/${id}`]);
  }

  deleteDoctor(id: number): void {
    if (confirm('Are you sure you want to delete this doctor?')) {
      this.apiService.deleteDoctor(id).subscribe({
        next: () => {
          console.log(`Doctor ${id} deleted successfully`);
          this.loadDoctors(); // Refresh the list
        },
        error: (error) => {
          console.error(`Error deleting doctor ${id}:`, error);
          this.errorMessage = 'Failed to delete doctor. Please try again.';
        }
      });
    }
  }
}