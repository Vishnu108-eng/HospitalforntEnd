import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { DoctorListComponent } from './doctor-list/doctor-list.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    DoctorListComponent
  ],
  exports: [DoctorListComponent]
})
export class DoctorsModule {}