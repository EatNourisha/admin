import { HashedDocumentPagination } from "./apiResponse.interface";
import { UserRo } from "./auth.interface";

export enum ConsultationType {
  DOCTOR = "doctor",
  THERAPIST = "therapist",
}

export enum MeansOfContact {
  VIDEO = "video_call",
  AUDIO = "audio_call",
  CHAT = "chat",
}

export interface AppointmentRO {
  _id: string;
  user: UserRo;
  status: string;
  consultationType: ConsultationType;
  meansOfContact: MeansOfContact;
  time: string;
  note: string;
  createdAt: string;
  updatedAt: string;
  doctor: UserRo;
}

export interface AppointmentStatsRO {
  count: number;
  status: string;
}

export type GetAppointmentsRO = HashedDocumentPagination<AppointmentRO[]>;
