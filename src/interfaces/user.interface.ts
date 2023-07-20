import { PaginatedDocument } from "./apiResponse.interface";
import { UserRo } from "./auth.interface";

export interface PlanRo {
  product_id: string;
  price_id: string;
  name: string;
  description: string;
  slug: string;
  amount: number;
  currency: string;
  subscription_interval: string;
  delivery_fee: string;
  perks: string[];
}

export interface SubscriptionRo {
  // Nourisha
  _id: string;
  stripe_id: string;
  plan: string | PlanRo;
  customer: string | UserRo;
  start_date: string;
  end_date: string;
  next_billing_date: string;
  status: string;
}

export interface TransactionRo {
  _id: string;
  customer: string;
  stripe_customer_id: string;

  itemRefPath: string;
  item: SubscriptionRo | string;
  plan: PlanRo | string;
  status: string;
  reason: string;
  payment_method: string;
  payment_gateway: string;
  reference: string;
  subscription_reference: string;
  currency: string;
  amount: number;
  invoice_url: string;
  invoice_download_url: string;
  createdAt: string;
  updatedAt: string;
}

export interface MealRo {
  createdAt: string;
  image_url: string;
  is_available: boolean;
  meals: string[];
  name: string;
  slug: string;
  updatedAt: string;
  _id: string;
}

export interface MealPackRo {
  breakfast: MealRo;
  lunch: MealRo;
  dinner: MealRo;
}

export interface LineupRo {
  monday: MealPackRo;
  tuesday: MealPackRo;
  wednesday: MealPackRo;
  thursday: MealPackRo;
  friday: MealPackRo;
}

export enum PlanInterval {
  WEEKLY = "week",
  MONTHLY = "month",
}

export interface PlanRo {
  _id: string;
  subscription_interval: string;
  product_id: string;
  price_id: string;
  name: string;
  description: string;
  slug: string;
  amount: number;
  currency: string;
  perks: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MealPackRo {
  name: string;
  slug: string;
  meals: string[];
  image_url: string;
  is_available: boolean;
}

export type GetBillHistory = PaginatedDocument<TransactionRo[]>;
export type GetSubscriptions = PaginatedDocument<SubscriptionRo[]>;
export type GetPlans = PaginatedDocument<PlanRo[]>;
export type GetMeals = PaginatedDocument<MealRo[]>;

export interface AddNewPlanDto
  extends Omit<
    PlanRo,
    "_id" | "createdAt" | "updatedAt" | "product_id" | "price_id" | "slug"
  > {}

export interface AddNewMealDto
  extends Omit<MealRo, "_id" | "createdAt" | "updatedAt" | "slug"> {}
