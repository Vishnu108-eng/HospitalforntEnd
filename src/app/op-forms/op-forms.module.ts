import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OpFormListComponent } from './op-form-list/op-form-list.component';
import { OpFormAddComponent } from './op-form-add/op-form-add.component';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    OpFormListComponent, // Import standalone component
    OpFormAddComponent,  // Import standalone component
    RouterModule.forChild([
      { path: '', component: OpFormListComponent },
      { path: 'add', component: OpFormAddComponent },
    ]),
  ],
})
export class OpFormsModule {}