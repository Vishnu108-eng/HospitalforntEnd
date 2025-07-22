export interface Invoice {
  id: number;
  appointmentId: number;
  consultationFee: number;
  pdfPath: string;
  createdAt: string;
}