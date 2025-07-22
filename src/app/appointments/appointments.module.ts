import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AppointmentBookingComponent } from './appointment-booking/appointment-booking.component';
import { AppointmentEditDialogComponent } from './appointment-edit-dialog/appointment-edit-dialog.component';
import { AppointmentListComponent } from './appointment-list/appointment-list.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    AppointmentBookingComponent,
    AppointmentListComponent,
    AppointmentEditDialogComponent
  ],
  exports: [
    AppointmentBookingComponent,
    AppointmentListComponent,
    AppointmentEditDialogComponent
  ]
})
export class AppointmentsModule { }