import ApiResponse, {
  HashedDocumentPagination,
  PaginatedDocument,
} from "./apiResponse.interface";
import { ConsultationType } from "./appointments.interface";
import { PlanRo, PromoRo } from "./user.interface";

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  UNSPECIFIED = "unspecified",
}

export interface RegisterUserDto {
  firstName: string;
  middleName?: string;
  lastName: string;
  userName?: string;
  email: string;
  gender?: Gender;
  password: string;
  phone?: string;
  role: string;
  refCode?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface VerifyEmailDto {
  code: string;
}

export interface RequestPasswordResetDto {
  email: string;
}

export interface AllergyRo {
  _id: string;
  description: string;
  name: string;
  slug: string;
  updatedAt: string;
  createdAt: string;
}

export interface UserRo {
  _id: string;
  email: string;

  firstName: string;
  lastName: string;

  first_name: string;
  last_name: string;
  phone: string;
  is_email_verified: boolean;
  delivery_day: string;
  delivery_info: {
    customer: string;
    next_delivery_date: string;
    delivery_day: string;
    createdAt: string;
    is_lineup_change_locked: boolean;
    next_lineup_change_date: string;
    updatedAt: string;
  };
  stripe_id: string;
  primary_role: string;

  preference: {
    allergies: AllergyRo[] | string[];
  };

  address: {
    address_: string;
    city: string;
    country: string;
    postcode: string;
  };

  lineup: string | {};

  createdAt: string;
  updatedAt: string;
  gender: Gender;
  provider: string;
  suspended: boolean;
  roles: string[];
  profilePhotoAttachment?: {
    url: string;
    thumbnailUrl: string;
    originalName: string;
    fileName: string;
    mimeType: string;
    _id: string;
  };
  profilePhotoThumbnailUrl?: string;
  profilePhotoUrl?: string;

  subscription?: {
    _id: string;
    user: string;
    __v: number;
    benefits: string[];
    createdAt: string;
    name: string;
    practitionerType: ConsultationType;
    price: {
      amount: number;
      previousAmount: number;
      currency: string;
    };
    schedule: string;
    subscription?: {
      _id: string;
      practitionerType: ConsultationType;
      schedule: string;
      __v: 0;
      benefits: string[];
      createdAt: string;
      name: string;
      price: {
        amount: number;
        previousAmount: number;
        currency: string;
      };
      trial: boolean;
      updatedAt: string;
    };
    trial: true;
    updatedAt: string;
    usageCount: number;
    validUntil: string;

    // Nourisha
    stripe_id: string;
    plan: {
      product_id: string;
      price_id: string;
      name: string;
      description: string;
      slug: string;
      amount: number;
      currency: string;
      subscription_interval: string;
      perks: string[];
    };
    customer: string;
    start_date: string;
    end_date: string;
    next_billing_date: string;
    status: string;
  };
  control: {
    suspended: boolean;
  };
  notes: string;
  ref_code: string;
}

export interface AuthPayload {
  sub: string;
  exp: number;
  roles: string[];
  email: string;
  is_verified: boolean;
}

export interface AuthRo {
  token: string;
  payload: AuthPayload;
}

export interface ResetPasswordDto {
  token: string;
  accountId: string;
  password: string;
}

interface MessageRo {
  message: string;
}

export interface ReferralRo {
  _id: string;
  is_subscribed: boolean;
  inviter: UserRo;
  invitee: UserRo;
  subscription_plan?: PlanRo;
  createdAt: string;
  updatedAt: string;
  reward: number;
  currency: number;
  ref_code: string;
  promo: PromoRo | string;
}

export interface ReferralStatsRo {
  fulfilled_withdrawals: number;
  pending_withdrawals: number;
  subscribed_invites: number;
  unsubscribed_invites: number;
}

export type RegisterUserRo = ApiResponse<AuthRo>;
export type LoginRo = ApiResponse<AuthRo>;
export type VerifyEmailRo = ApiResponse<AuthRo>;
export type RequestVerificationCodeRo = ApiResponse<MessageRo>;
export type RequestPasswordResetRo = ApiResponse<MessageRo>;
export type ResetPasswordRo = ApiResponse<UserRo>;

export type GetUsersRO = HashedDocumentPagination<UserRo[]>;

export type GetReferralsRo = PaginatedDocument<ReferralRo[]>;
export type GetUsersRo = PaginatedDocument<UserRo[]>;
