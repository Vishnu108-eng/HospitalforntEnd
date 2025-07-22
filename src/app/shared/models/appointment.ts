import { Doctor } from "./doctor";

export interface Appointment {
  id: number;
  doctorId: number;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  appointmentDate: Date;
  appointmentTime: string;
  status: string;
  doctor?: Doctor;
}

export interface AppointmentCreateDto {
  doctorId: number;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  appointmentDate: Date;
  appointmentTime: string;
}