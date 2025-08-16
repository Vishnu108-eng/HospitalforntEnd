import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Doctor } from './models/doctor';
import { Appointment } from './models/appointment';
import { DashboardViewModel } from './models/dashboard-view-model';
import { Invoice } from './models/invoice';
import { LoginViewModel } from './models/login-view-model';
import { OPForm } from './models/op-form';
import { Prescription, PrescriptionCreate } from './models/prescription';
import { RegisterViewModel } from './models/register-view-model';
import { ForgotPasswordViewModel } from './models/forgot-password-view-model';
import { ResetPasswordViewModel } from './models/reset-password-view-model';
import { Country } from './models/country.model';

interface AuthResponse {
  username: string | undefined;
  email: any;
  isSuccess: boolean;
  message?: string;
  token?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'https://localhost:44354/api';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    });
  }

  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    let errorMessage = 'An error occurred while communicating with the server.';
    if (error.status === 401) {
      errorMessage = 'Unauthorized: Please log in again.';
    } else if (error.status === 404) {
      errorMessage = 'Resource not found.';
    } else if (error.status === 400) {
      errorMessage = error.error?.message || 'Invalid request data.';
    } else if (error.status === 500) {
      errorMessage = 'Server error. Please try again later.';
    } else if (error.status === 0) {
      errorMessage = 'Unable to connect to the server. Ensure the server is running and the SSL certificate is trusted.';
    }
    return throwError(() => new Error(errorMessage));
  }

  // Authentication APIs
  register(model: RegisterViewModel): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/Auth/register`, model).pipe(catchError(this.handleError));
  }

  login(model: LoginViewModel): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/Auth/login`, model).pipe(catchError(this.handleError));
  }

  forgotPassword(model: ForgotPasswordViewModel): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/Auth/forgot-password`, model).pipe(catchError(this.handleError));
  }

  resetPassword(model: ResetPasswordViewModel): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/Auth/reset-password`, model).pipe(catchError(this.handleError));
  }

  // Doctor APIs
  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.apiUrl}/Doctor`, { headers: this.getAuthHeaders() }).pipe(catchError(this.handleError));
  }

  getDoctor(id: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}/Doctor/${id}`, { headers: this.getAuthHeaders() }).pipe(catchError(this.handleError));
  }

  createDoctor(doctor: Doctor): Observable<Doctor> {
    return this.http.post<Doctor>(`${this.apiUrl}/Doctor`, doctor, { headers: this.getAuthHeaders() }).pipe(catchError(this.handleError));
  }

  updateDoctor(id: number, doctor: Doctor): Observable<Doctor> {
    return this.http.put<Doctor>(`${this.apiUrl}/Doctor/${id}`, doctor, { headers: this.getAuthHeaders() }).pipe(catchError(this.handleError));
  }

  deleteDoctor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Doctor/${id}`, { headers: this.getAuthHeaders() }).pipe(catchError(this.handleError));
  }

  // Appointment APIs
  bookAppointment(appointment: any): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.apiUrl}/Appointment/book`, appointment, { headers: this.getAuthHeaders() }).pipe(catchError(this.handleError));
  }

  getAppointments(email: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/Appointment/list?email=${email}`, { headers: this.getAuthHeaders() }).pipe(catchError(this.handleError));
  }

  updateAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/Appointment/${appointment.id}`, appointment, { headers: this.getAuthHeaders() }).pipe(catchError(this.handleError));
  }

  cancelAppointment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Appointment/cancel/${id}`, { headers: this.getAuthHeaders() }).pipe(catchError(this.handleError));
  }

  createPrescription(prescription: PrescriptionCreate): Observable<Prescription> {
    return this.http.post<Prescription>(`${this.apiUrl}/Prescription`, prescription, { headers: this.getAuthHeaders() }).pipe(catchError(this.handleError));
  }

  getPrescriptionsByAppointment(appointmentId: number): Observable<Prescription[]> {
    return this.http.get<Prescription[]>(`${this.apiUrl}/Prescription/appointment/${appointmentId}`, { headers: this.getAuthHeaders() }).pipe(catchError(this.handleError));
  }

  downloadPrescription(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/Prescription/download/${id}`, { headers: this.getAuthHeaders(), responseType: 'blob' }).pipe(catchError(this.handleError));
  }
  
   getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(`${this.apiUrl}/Auth`);
  }

  // Invoice APIs
  getInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.apiUrl}/Invoice`, { headers: this.getAuthHeaders() }).pipe(catchError(this.handleError));
  }

  getInvoiceByAppointment(appointmentId: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.apiUrl}/Invoice/appointment/${appointmentId}`, { headers: this.getAuthHeaders() }).pipe(catchError(this.handleError));
  }

  createInvoice(invoice: { appointmentId: number; consultationFee: number }): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.apiUrl}/Invoice`, invoice, { headers: this.getAuthHeaders() }).pipe(catchError(this.handleError));
  }

  downloadInvoice(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/Invoice/download/${id}`, {
      headers: this.getAuthHeaders(),
      responseType: 'blob',
    }).pipe(catchError(this.handleError));
  }

  // OP Form APIs
  getAllOPForms(): Observable<OPForm[]> {
    return this.http.get<OPForm[]>(`${this.apiUrl}/OPForm`, { headers: this.getAuthHeaders() }).pipe(catchError(this.handleError));
  }

  getOPForm(id: number): Observable<OPForm> {
    return this.http.get<OPForm>(`${this.apiUrl}/OPForm/${id}`, { headers: this.getAuthHeaders() }).pipe(catchError(this.handleError));
  }

  getOPFormByAppointment(appointmentId: number): Observable<OPForm> {
    return this.http.get<OPForm>(`${this.apiUrl}/OPForm/appointment/${appointmentId}`, { headers: this.getAuthHeaders() }).pipe(catchError(this.handleError));
  }

  createOPForm(opForm: OPForm): Observable<any> {
    console.log('Sending OP Form:', opForm);
    return this.http.post<any>(`${this.apiUrl}/OPForm`, opForm, { headers: this.getAuthHeaders() }).pipe(catchError(this.handleError));
  }

  downloadOPForm(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/OPForm/download/${id}`, {
      headers: this.getAuthHeaders(),
      responseType: 'blob',
    }).pipe(catchError(this.handleError));
  }

  // Dashboard API
  getDashboardData(): Observable<DashboardViewModel> {
    return this.http.get<DashboardViewModel>(`${this.apiUrl}/Dashboard/summary`, { headers: this.getAuthHeaders() }).pipe(catchError(this.handleError));
  }
}