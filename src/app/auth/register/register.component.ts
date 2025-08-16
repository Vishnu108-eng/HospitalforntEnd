import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ApiService } from '../../shared/api.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

interface Country {
  code: string;
  name: string;
  flag: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatCheckboxModule
  ]
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;
  showPassword: boolean = false;
  selectedCountryFlag: string | null = null;
  selectedCountryName: string | null = null;
   countries: Country[] = [];
  // countries: Country[] = [
  //   { code: '+61', name: 'Australia', flag: 'https://flagcdn.com/16x12/au.png' },
  //   { code: '+32', name: 'Belgium', flag: 'https://flagcdn.com/16x12/be.png' },
  //   { code: '+55', name: 'Brazil', flag: 'https://flagcdn.com/16x12/br.png' },
  //   { code: '+20', name: 'Egypt', flag: 'https://flagcdn.com/16x12/eg.png' },
  //   { code: '+33', name: 'France', flag: 'https://flagcdn.com/16x12/fr.png' },
  //   { code: '+30', name: 'Greece', flag: 'https://flagcdn.com/16x12/gr.png' },
  //   { code: '+49', name: 'Germany', flag: 'https://flagcdn.com/16x12/de.png' },
  //   { code: '+39', name: 'Italy', flag: 'https://flagcdn.com/16x12/it.png' },
  //   { code: '+62', name: 'Indonesia', flag: 'https://flagcdn.com/16x12/id.png' },
  //   { code: '+1', name: 'Canada', flag: 'https://flagcdn.com/16x12/ca.png' },
  //   { code: '+1', name: 'USA', flag: 'https://flagcdn.com/16x12/us.png' },
  //   { code: '+86', name: 'China', flag: 'https://flagcdn.com/16x12/cn.png' },
  //   { code: '+91', name: 'India', flag: 'https://flagcdn.com/16x12/in.png' },
  //   { code: '+64', name: 'New Zealand', flag: 'https://flagcdn.com/16x12/nz.png' },
  //   { code: '+47', name: 'Norway', flag: 'https://flagcdn.com/16x12/no.png' },
  //   { code: '+92', name: 'Pakistan', flag: 'https://flagcdn.com/16x12/pk.png' },
  //   { code: '+351', name: 'Portugal', flag: 'https://flagcdn.com/16x12/pt.png' },
  //   { code: '+34', name: 'Spain', flag: 'https://flagcdn.com/16x12/es.png' },
  //   { code: '+82', name: 'South Korea', flag: 'https://flagcdn.com/16x12/kr.png' },
  //   { code: '+27', name: 'South Africa', flag: 'https://flagcdn.com/16x12/za.png' },
  //   { code: '+41', name: 'Switzerland', flag: 'https://flagcdn.com/16x12/ch.png' },
  //   { code: '+46', name: 'Sweden', flag: 'https://flagcdn.com/16x12/se.png' },
  //   { code: '+60', name: 'Malaysia', flag: 'https://flagcdn.com/16x12/my.png' },
  //   { code: '+81', name: 'Japan', flag: 'https://flagcdn.com/16x12/jp.png' },
  //   { code: '+7', name: 'Russia', flag: 'https://flagcdn.com/16x12/ru.png' },
  //   { code: '+98', name: 'Iran', flag: 'https://flagcdn.com/16x12/ir.png' },
  //   { code: '+31', name: 'Netherlands', flag: 'https://flagcdn.com/16x12/nl.png' },
  //   { code: '+45', name: 'Denmark', flag: 'https://flagcdn.com/16x12/dk.png' },
  //   { code: '+44', name: 'UK', flag: 'https://flagcdn.com/16x12/gb.png' },
  //   { code: '+971', name: 'UAE', flag: 'https://flagcdn.com/16x12/ae.png' }
  // ];

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[A-Z])(?=.*[\W_]).+$/)]],
      confirmPassword: ['', Validators.required],
      countryCode: ['+91', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      phoneNumberFull: [''],
      gender: ['', [Validators.required, Validators.pattern(/^(Male|Female)$/)]],
      address: ['', [Validators.required, Validators.maxLength(200)]]
    }, { validator: this.passwordMatchValidator });

    // Set default phone number
    this.registerForm.patchValue({
      phoneNumber: null
    });


    // Initialize phoneNumberFull and flag
    this.updatePhoneNumberFull();
    this.updateSelectedCountryFlag();

    // Listen to changes in countryCode or phoneNumber
    this.registerForm.get('countryCode')?.valueChanges.subscribe(() => {
      this.updatePhoneNumberFull();
      this.updateSelectedCountryFlag();
    });
    this.registerForm.get('phoneNumber')?.valueChanges.subscribe(() => this.updatePhoneNumberFull());
    this.apiService.getCountries().subscribe({
        next: (data) => {
          this.countries = data;
          this.updateSelectedCountryFlag(); // ✅ Call here after countries are loaded
        },
        error: (err) => console.error('Error loading countries', err)
      });
  }

  passwordMatchValidator(form: FormGroup): ValidationErrors | null {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  updatePhoneNumberFull(): void {
    const countryCode = this.registerForm.get('countryCode')?.value;
    const phoneNumber = this.registerForm.get('phoneNumber')?.value;
    if (countryCode && phoneNumber) {
      this.registerForm.get('phoneNumberFull')?.setValue(`${countryCode}${phoneNumber}`, { emitEvent: false });
    } else {
      this.registerForm.get('phoneNumberFull')?.setValue('', { emitEvent: false });
    }
  }

  updateSelectedCountryFlag(): void {
    const countryCode = this.registerForm.get('countryCode')?.value;
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
    const phoneNumberControl = this.registerForm.get('phoneNumber');
    phoneNumberControl?.updateValueAndValidity();
  }

  formatPhoneNumber(): void {
    let phoneNumber = this.registerForm.get('phoneNumber')?.value || '';
    phoneNumber = phoneNumber.replace(/[^0-9]/g, ''); // Remove non-digits
    if (phoneNumber.length > 10) {
      phoneNumber = phoneNumber.slice(0, 10); // Limit to 10 digits
    }
    this.registerForm.get('phoneNumber')?.setValue(phoneNumber, { emitEvent: false });
    this.updatePhoneNumberFull();
  }
  

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.errorMessage = null;
      const formValue = this.registerForm.value;
      const model = {
        fullName: formValue.fullName,
        email: formValue.email,
        password: formValue.password,
        confirmPassword: formValue.confirmPassword,
        phoneNumber: formValue.phoneNumberFull, // Use full phone number
        gender: formValue.gender,
        address: formValue.address
      };
      console.log('RegisterComponent: Submitting payload', model);
      this.apiService.register(model).subscribe({
        next: (response) => {
          console.log('RegisterComponent: Registration response', response);
          if (response.isSuccess) {
            this.router.navigate(['/login'], { queryParams: { registered: true } });
          } else {
            this.errorMessage = response.message || 'Registration failed';
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('RegisterComponent: Registration failed', error);
          if (error.status === 400 && error.error?.errors) {
            const validationErrors = Object.values(error.error.errors).flat().join('; ');
            this.errorMessage = `Registration failed: ${validationErrors}`;
          } else if (error.status === 409) {
            this.errorMessage = 'Email already exists';
          } else {
            this.errorMessage = error.error?.message || 'Registration failed: Server error';
          }
        }
      });
    } else {
      this.errorMessage = 'Please fill out the form correctly';
      console.log('RegisterComponent: Form invalid', this.registerForm.errors, this.registerForm.value);
    }
  
    
  }
}