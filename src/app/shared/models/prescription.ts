export interface Prescription {
  id: number;
  appointmentId: number;
  medication: string;
  instructions: string;
  description?: string;
  createdAt: string;
  pdfPath: string;
}

export interface PrescriptionCreate {
  appointmentId: number;
  medication: string;
  instructions: string;
  description?: string;
}