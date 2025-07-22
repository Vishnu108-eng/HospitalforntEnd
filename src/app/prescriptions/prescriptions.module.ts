import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule, Routes } from '@angular/router';
import { PrescriptionListComponent } from './prescription-list/prescription-list.component';
import { AddPrescriptionComponent } from './add-prescription/add-prescription.component';
import { AuthGuard } from '../shared/auth.guard';

const routes: Routes = [
  { path: '', component: PrescriptionListComponent, canActivate: [AuthGuard] },
  { path: 'add', component: AddPrescriptionComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule.forChild(routes),
    PrescriptionListComponent,
    AddPrescriptionComponent
  ],
  declarations: [],
  exports: [
    PrescriptionListComponent,
    AddPrescriptionComponent
  ]
})
export class PrescriptionsModule { }