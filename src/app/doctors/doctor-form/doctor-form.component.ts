import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../shared/api.service';
import { Doctor } from '../../shared/models/doctor';

interface Country {
  code: string;
  name: string;
  flag: string;
}

@Component({
  selector: 'app-doctor-form',
  templateUrl: './doctor-form.component.html',
  styleUrls: ['./doctor-form.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule
  ]
})
export class DoctorFormComponent implements OnInit {
  doctorForm: FormGroup;
  errorMessage: string | null = null;
  isEditMode: boolean = false;
  doctorId: number | null = null;
  selectedCountryFlag: string | null = null;
  selectedCountryName: string | null = null;
  submitted: boolean = false;
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
    { code: '+971', name: 'UAE', flag: 'https://flagcdn.com/16x12/ae.png' }
  ];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.doctorForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.maxLength(100)]],
      specialization: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      countryCode: ['+91', Validators.required], // Default to India
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      phoneNumberFull: [''], // Hidden field to store full phone number
      gender: ['', [Validators.required, Validators.pattern(/^(Male|Female)$/)]],
      isAvailable: [false]
    });

    // Initialize phoneNumberFull with country code + phone number
    this.updatePhoneNumberFull();
    this.updateSelectedCountryFlag(); // Initialize flag on load
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.doctorId = +id;
        this.loadDoctor(this.doctorId);
      }
    });

    // Listen to changes in countryCode or phoneNumber to update phoneNumberFull and flag
    this.doctorForm.get('countryCode')?.valueChanges.subscribe(() => {
      this.updatePhoneNumberFull();
      this.updateSelectedCountryFlag();
    });
    this.doctorForm.get('phoneNumber')?.valueChanges.subscribe(() => this.updatePhoneNumberFull());
  }

  loadDoctor(id: number): void {
    this.apiService.getDoctor(id).subscribe({
      next: (doctor) => {
        let countryCode = '+91'; // Default
        let phoneNumber = doctor.phoneNumber;
        const country = this.countries.find(c => doctor.phoneNumber.startsWith(c.code));
        if (country) {
          countryCode = country.code;
          phoneNumber = doctor.phoneNumber.slice(country.code.length);
        }

        this.doctorForm.patchValue({
          fullName: doctor.fullName,
          specialization: doctor.specialization,
          email: doctor.email,
          countryCode: countryCode,
          phoneNumber: phoneNumber,
          phoneNumberFull: doctor.phoneNumber,
          gender: doctor.gender,
          isAvailable: doctor.isAvailable
        });

        this.updateSelectedCountryFlag(); // Update flag after loading doctor
      },
      error: (error) => {
        console.error(`Error loading doctor ${id}:`, error);
        this.errorMessage = 'Failed to load doctor details.';
      }
    });
  }

  updatePhoneNumberFull(): void {
    const countryCode = this.doctorForm.get('countryCode')?.value;
    const phoneNumber = this.doctorForm.get('phoneNumber')?.value;
    if (countryCode && phoneNumber) {
      this.doctorForm.get('phoneNumberFull')?.setValue(`${countryCode}${phoneNumber}`, { emitEvent: false });
    } else {
      this.doctorForm.get('phoneNumberFull')?.setValue('', { emitEvent: false });
    }
  }

  updateSelectedCountryFlag(): void {
    const countryCode = this.doctorForm.get('countryCode')?.value;
    const country = this.countries.find(c => c.code === countryCode);
    if (country) {
      this.selectedCountryFlag = country.flag;
      this.selectedCountryName = country.name;
    } else {
      this.selectedCountryFlag = null;
      this.selectedCountryName = null;
    }
  }

  updatePhoneValidator(): void {
    const phoneNumberControl = this.doctorForm.get('phoneNumber');
    phoneNumberControl?.updateValueAndValidity();
  }

  formatPhoneNumber(): void {
    let phoneNumber = this.doctorForm.get('phoneNumber')?.value || '';
    phoneNumber = phoneNumber.replace(/[^0-9]/g, ''); // Remove non-digits
    if (phoneNumber.length > 10) {
      phoneNumber = phoneNumber.slice(0, 10); // Limit to 10 digits
    }
    this.doctorForm.get('phoneNumber')?.setValue(phoneNumber, { emitEvent: false });
    this.updatePhoneNumberFull();
  }

  onSubmit(): void {
    this.submitted = true; // Set submitted flag to true
    if (this.doctorForm.valid) {
      this.errorMessage = null;
      const doctor: Doctor = {
        id: this.isEditMode ? this.doctorId! : 0,
        fullName: this.doctorForm.value.fullName,
        specialization: this.doctorForm.value.specialization,
        email: this.doctorForm.value.email,
        phoneNumber: this.doctorForm.value.phoneNumberFull, // Use full phone number
        gender: this.doctorForm.value.gender,
        isAvailable: this.doctorForm.value.isAvailable
      };

      if (this.isEditMode) {
        this.apiService.updateDoctor(this.doctorId!, doctor).subscribe({
          next: () => {
            console.log(`Doctor ${this.doctorId} updated successfully`);
            this.router.navigate(['/doctors']);
          },
          error: (error) => {
            console.error(`Error updating doctor ${this.doctorId}:`, error);
            this.errorMessage = 'Failed to update doctor.';
          }
        });
      } else {
        this.apiService.createDoctor(doctor).subscribe({
          next: (createdDoctor) => {
            console.log('Doctor created successfully:', createdDoctor);
            this.router.navigate(['/doctors']);
          },
          error: (error) => {
            console.error('Error creating doctor:', error);
            this.errorMessage = 'Failed to create doctor.';
          }
        });
      }
    } else {
      this.errorMessage = 'Please fill out the form correctly.';
    }
  }

  cancel(): void {
    this.submitted = false; // Reset submitted flag
    this.router.navigate(['/doctors']);
  }
}