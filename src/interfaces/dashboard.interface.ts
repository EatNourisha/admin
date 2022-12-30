import { Gender } from "./auth.interface";

export interface GenderScore {
  count: number;
  month: number;
  gender: Gender;
}

export interface GenderDemoGraphicRo {
  month: number;
  dayOfWeek: number;
  genderScores: GenderScore[];
}

export interface DashboardRo {
  totalAppointments: number;
  totalPatients: number;
  totalDoctors: number;
  totalPatientsForPeriod: number;
  totalSubscriptionPayment: number;
  totalDoctorSubscriptionPayment: number;
  totalFreeTrialSubscriptionPayment: number;
  totalTherapistSubscriptionPayment: number;
  genderDemoGraphic: GenderDemoGraphicRo[];
}
