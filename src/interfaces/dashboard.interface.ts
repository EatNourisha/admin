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
  //Nourisha
  meals: number;
  customers: number;
  subscriptions: number;
  orders: number;
}
