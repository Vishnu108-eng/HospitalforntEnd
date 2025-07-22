import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Appointment } from '../../shared/models/appointment';
import { ApiService } from '../../shared/api.service';
import { Doctor } from '../../shared/models/doctor';

interface Country {
  code: string;
  name: string;
  flag: string;
}

@Component({
  selector: 'app-appointment-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule
  ],
  templateUrl: './appointment-edit-dialog.component.html',
  styleUrls: ['./appointment-edit-dialog.component.css']
})
export class AppointmentEditDialogComponent {
  editForm: FormGroup;
  doctors: Doctor[] = [];
  countries: Country[] = [
    { code: '+61', name: 'Australia', flag: 'https://flagcdn.com/16x12/au.png' },
    { code: '+32', name: 'Belgium', flag: 'https://flagcdn.com/16x12/be.png' },
    { code: '+55', name: 'Brazil', flag: 'https://flagcdn.com/16x12/br.png' },
    { code: '+20', name: 'Egypt', flag: 'https://flagcdn.com/16x12/eg.png' },
    { code: '+33', name: 'France', flag: 'https://flagcdn.com/16x12/fr.png' },
    { code: '+30', name: 'Greece', flag: 'https://flagcdn.com/16x12/gr.png' },
    { code: '+49', name: 'Germany', flag: 'https://flagcdn.com/16x12/de.png' },
    { code: '+39', name: 'Italy', flag: 'https://flagcdn.com/16x12/it.png' },
    { code: '+62', name: 'Indonesia', flag: 'https://flagcdn.com/16x12/id.png' },
    { code: '+1', name: 'Canada', flag: 'https://flagcdn.com/16x12/ca.png' },
    { code: '+1', name: 'USA', flag: 'https://flagcdn.com/16x12/us.png' },
    { code: '+86', name: 'China', flag: 'https://flagcdn.com/16x12/cn.png' },
    { code: '+91', name: 'India', flag: 'https://flagcdn.com/16x12/in.png' },
    { code: '+64', name: 'New Zealand', flag: 'https://flagcdn.com/16x12/nz.png' },
    { code: '+47', name: 'Norway', flag: 'https://flagcdn.com/16x12/no.png' },
    { code: '+92', name: 'Pakistan', flag: 'https://flagcdn.com/16x12/pk.png' },
    { code: '+351', name: 'Portugal', flag: 'https://flagcdn.com/16x12/pt.png' },
    { code: '+34', name: 'Spain', flag: 'https://flagcdn.com/16x12/es.png' },
    { code: '+82', name: 'South Korea', flag: 'https://flagcdn.com/16x12/kr.png' },
    { code: '+27', name: 'South Africa', flag: 'https://flagcdn.com/16x12/za.png' },
    { code: '+41', name: 'Switzerland', flag: 'https://flagcdn.com/16x12/ch.png' },
    { code: '+46', name: 'Sweden', flag: 'https://flagcdn.com/16x12/se.png' },
    { code: '+60', name: 'Malaysia', flag: 'https://flagcdn.com/16x12/my.png' },
    { code: '+81', name: 'Japan', flag: 'https://flagcdn.com/16x12/jp.png' },
    { code: '+7', name: 'Russia', flag: 'https://flagcdn.com/16x12/ru.png' },
    { code: '+98', name: 'Iran', flag: 'https://flagcdn.com/16x12/ir.png' },
    { code: '+31', name: 'Netherlands', flag: 'https://flagcdn.com/16x12/nl.png' },
    { code: '+45', name: 'Denmark', flag: 'https://flagcdn.com/16x12/dk.png' },
    { code: '+44', name: 'UK', flag: 'https://flagcdn.com/16x12/gb.png' },
    { code: '+971', name: 'UAE', flag: 'https://flagcdn.com/16x12/ae.png' },
  ];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<AppointmentEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Appointment
  ) {
    // let appointmentDate='';
    // if(data.appointmentDate)
    // {
    //   const date= new Date(data.appointmentDate);
    //   appointmentDate = date.toISOString().split('T')[0];
    // }
    // Extract country code and phone number
    let countryCode = '+91'; // Default to +91
    let phoneNumber = data.patientPhone || '';
    if (data.patientPhone) {
      const match = data.patientPhone.match(/^(\+\d{1,3})(\d{10})$/);
      if (match) {
        countryCode = match[1];
        phoneNumber = match[2];
      } else {
        // If phone number doesn't match expected format, use it as is
        phoneNumber = data.patientPhone.replace(/^\+\d{1,3}/, '') || data.patientPhone;
      }
    }

    this.editForm = this.fb.group({
      id: [data.id],
      doctorId: [data.doctorId, Validators.required],
      patientName: [data.patientName, [Validators.required, Validators.minLength(3)]],
      patientEmail: [data.patientEmail, [Validators.required, Validators.email]],
      countryCode: [countryCode, Validators.required],
      phoneNumber: [phoneNumber, [Validators.required, Validators.pattern(/^\d{10}$/)]],
      appointmentDate: [new Date(data.appointmentDate), Validators.required],
      appointmentTime: [data.appointmentTime, [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)\s+to\s+(0[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/)]],
      status: [data.status, Validators.required]
    });

    this.apiService.getDoctors().subscribe({
      next: (doctors) => {
        this.doctors = doctors.filter(doctor => doctor.isAvailable);
      },
      error: (error) => {
        console.error('Error fetching doctors', error);
      }
    });
  }

  onSubmit(): void {
    if (this.editForm.valid) {
      const formValue = this.editForm.value;
      // Combine country code and phone number
      const updatedAppointment = {
        ...formValue,
        patientPhone: `${formValue.countryCode}${formValue.phoneNumber}`
      };
      delete updatedAppointment.countryCode;
      delete updatedAppointment.phoneNumber;
      this.dialogRef.close(updatedAppointment);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}