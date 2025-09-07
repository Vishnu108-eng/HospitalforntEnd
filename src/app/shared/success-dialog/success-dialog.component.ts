import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-success-dialog',
  templateUrl: './success-dialog.component.html',
  styleUrls: ['./success-dialog.component.css']
})
export class SuccessDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SuccessDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      message?: string;  
      doctorId: number;
      patientName: string;
      patientEmail: string;
      patientPhone: string;
      appointmentDate: string;
      appointmentTime: string;
    }
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
