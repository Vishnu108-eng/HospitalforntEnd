import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { AddInvoiceComponent } from './add-invoice/add-invoice.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    InvoiceListComponent, // Import standalone component
    AddInvoiceComponent,  // Import standalone component
  ],
  exports: [
    InvoiceListComponent,
    AddInvoiceComponent,
  ],
})
export class InvoicesModule {}