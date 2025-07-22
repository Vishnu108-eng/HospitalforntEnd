import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../shared/api.service';
import { PrescriptionCreate } from '../../shared/models/prescription';
import { Appointment } from '../../shared/models/appointment';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-prescription',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './add-prescription.component.html',
  styleUrls: ['./add-prescription.component.css']
})
export class AddPrescriptionComponent implements OnInit {
  prescriptionForm: FormGroup;
  appointments$!: Observable<Appointment[]>;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.prescriptionForm = this.fb.group({
      appointmentId: ['', [Validators.required]],
      medication: ['', [Validators.required, Validators.maxLength(500)]],
      instructions: ['', [Validators.required, Validators.maxLength(1000)]],
      description: ['', [Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    const userEmail = localStorage.getItem('userEmail') || 'user@example.com'; // Adjust based on your auth logic
    this.appointments$ = this.apiService.getAppointments(userEmail);
  }

  onSubmit(): void {
    if (this.prescriptionForm.valid) {
      const prescription: PrescriptionCreate = {
        appointmentId: this.prescriptionForm.get('appointmentId')?.value,
        medication: this.prescriptionForm.get('medication')?.value,
        instructions: this.prescriptionForm.get('instructions')?.value,
        description: this.prescriptionForm.get('description')?.value || null
      };

      this.apiService.createPrescription(prescription).subscribe({
        next: (response) => {
          alert('Prescription added successfully.');
          this.router.navigate(['/prescriptions']);
        },
        error: (error) => {
          console.error('Error creating prescription:', error);
          alert(`Failed to add prescription: ${error.message}`);
        }
      });
    } else {
      alert('Please fill out the form correctly.');
      this.prescriptionForm.markAllAsTouched();
    }
  }
}