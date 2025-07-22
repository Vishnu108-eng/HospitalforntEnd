export interface OPForm {
  id?: number;
  appointmentId: number;
  appointment?: {
    id: number;
    patientName: string;
    doctor?: { fullName: string };
  };
  symptoms: string;
  diagnosis: string;
  treatment: string;
  remarks?: string | null;
  prescriptionId?: number | null;
  invoiceId?: number | null;
  pdfPath?: string;
  createdAt: string;
}