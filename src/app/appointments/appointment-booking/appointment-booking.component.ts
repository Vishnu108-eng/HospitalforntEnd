import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../shared/api.service';
import { Doctor } from '../../shared/models/doctor';
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from '../../shared/success-dialog/success-dialog.component';


interface Country {
  code: string;
  name: string;
  flag: string;
}

@Component({
  selector: 'app-appointment-booking',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './appointment-booking.component.html',
  styleUrls: ['./appointment-booking.component.css']
})
export class AppointmentBookingComponent implements OnInit {
  appointmentForm: FormGroup;
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

  selectedCountry: Country | null = null;
  isDropdownOpen: boolean = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.appointmentForm = this.fb.group({
      doctorId: ['', Validators.required],
      patientName: ['', [Validators.required, Validators.minLength(3)]],
      patientEmail: ['', [Validators.required, Validators.email]],
      countryCode: ['+91', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      patientPhone: [''],
      appointmentDate: ['', Validators.required],
      appointmentTime: ['', [
        Validators.required,
        Validators.pattern(/^(0[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)\s+to\s+(0[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/)
      ]]
    });

    this.selectedCountry = this.countries.find(country => country.code === '+91') || null;
    this.updatePatientPhone();
  }

  ngOnInit(): void {
    this.apiService.getDoctors().subscribe({
      next: (data: Doctor[]) => {
        this.doctors = data.filter(doctor => doctor.isAvailable);
      },
      error: (error: any) => {
        console.error('Error fetching doctors', error);
        alert('Failed to fetch doctors.');
      }
    });

    this.appointmentForm.get('countryCode')?.valueChanges.subscribe(() => this.updatePatientPhone());
    this.appointmentForm.get('phoneNumber')?.valueChanges.subscribe(() => this.updatePatientPhone());
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectCountry(country: Country): void {
    this.selectedCountry = country;
    this.appointmentForm.get('countryCode')?.setValue(country.code);
    this.isDropdownOpen = false;
    this.updatePhoneValidator();
  }

  updatePatientPhone(): void {
    const countryCode = this.appointmentForm.get('countryCode')?.value;
    const phoneNumber = this.appointmentForm.get('phoneNumber')?.value;
    if (countryCode && phoneNumber) {
      this.appointmentForm.get('patientPhone')?.setValue(`${countryCode}${phoneNumber}`, { emitEvent: false });
    } else {
      this.appointmentForm.get('patientPhone')?.setValue('', { emitEvent: false });
    }
  }

  updatePhoneValidator(): void {
    const phoneNumberControl = this.appointmentForm.get('phoneNumber');
    phoneNumberControl?.updateValueAndValidity();
  }

  formatPhoneNumber(): void {
    let phoneNumber = this.appointmentForm.get('phoneNumber')?.value || '';
    phoneNumber = phoneNumber.replace(/[^0-9]/g, '');
    if (phoneNumber.length > 10) {
      phoneNumber = phoneNumber.slice(0, 10);
    }
    this.appointmentForm.get('phoneNumber')?.setValue(phoneNumber, { emitEvent: false });
    this.updatePatientPhone();
  }

  onSubmit(): void {
    if (this.appointmentForm.valid) {
      const payload = {
        doctorId: parseInt(this.appointmentForm.value.doctorId, 10),
        patientName: this.appointmentForm.value.patientName,
        patientEmail: this.appointmentForm.value.patientEmail,
        patientPhone: this.appointmentForm.value.patientPhone,
        appointmentDate: new Date(this.appointmentForm.value.appointmentDate).toISOString().split('T')[0],
        appointmentTime: this.appointmentForm.value.appointmentTime
      };

      this.apiService.bookAppointment(payload).subscribe({
        next: () => {
          const dialogRef = this.dialog.open(SuccessDialogComponent, {
            width: '400px',
            data: payload  // pass entire appointment data
          });

          dialogRef.afterClosed().subscribe(() => {
            this.router.navigate(['/appointments']);
          });
        },
        error: (error: any) => {
          console.error('Error booking appointment', error);
          const errorMessage = error.error?.errors 
            ? Object.values(error.error.errors).flat().join(' ')
            : 'Failed to book appointment. Please check the form data.';
          alert(errorMessage);
        }
      });
    }
  }
}