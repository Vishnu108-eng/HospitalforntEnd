import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { DoctorListComponent } from './doctors/doctor-list/doctor-list.component';
import { DoctorFormComponent } from './doctors/doctor-form/doctor-form.component';
import { AppointmentBookingComponent } from './appointments/appointment-booking/appointment-booking.component';
import { AppointmentListComponent } from './appointments/appointment-list/appointment-list.component';
import { InvoiceListComponent } from './invoices/invoice-list/invoice-list.component';
import { AddInvoiceComponent } from './invoices/add-invoice/add-invoice.component';
import { OpFormListComponent } from './op-forms/op-form-list/op-form-list.component';
import { OpFormAddComponent } from './op-forms/op-form-add/op-form-add.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'doctors', component: DoctorListComponent, canActivate: [AuthGuard] },
  { path: 'doctors/add', component: DoctorFormComponent, canActivate: [AuthGuard] },
  { path: 'doctors/edit/:id', component: DoctorFormComponent, canActivate: [AuthGuard] },
  { path: 'appointments', component: AppointmentListComponent, canActivate: [AuthGuard] },
  { path: 'appointments/book', component: AppointmentBookingComponent, canActivate: [AuthGuard] },
  { path: 'invoices', component: InvoiceListComponent, canActivate: [AuthGuard] },
  { path: 'invoices/add', component: AddInvoiceComponent, canActivate: [AuthGuard] },
  { path: 'op-forms', component: OpFormListComponent, canActivate: [AuthGuard] },
  { path: 'op-forms/add', component: OpFormAddComponent, canActivate: [AuthGuard] },
  { path: 'prescriptions', loadChildren: () => import('./prescriptions/prescriptions.module').then(m => m.PrescriptionsModule), canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }