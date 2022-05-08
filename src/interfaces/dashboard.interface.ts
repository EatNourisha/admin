import { Gender } from "./auth.interface";

export interface GenderScore {
  count: number;
  month: number;
  gender: Gender;
}

export interface GenderDemoGraphicRo {
  month: number;
  genderScores: GenderScore[];
}

export interface DashboardRo {
  totalAppointments: number;
  totalPatients: number;
  totalDoctors: number;
  genderDemoGraphic: GenderDemoGraphicRo[];
}
