import ApiResponse, {
  HashedDocumentPagination,
  PaginatedDocument,
} from "./apiResponse.interface";
import { ConsultationType } from "./appointments.interface";

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

export interface UserRo {
  _id: string;
  email: string;

  //Deprecated
  firstName: string;
  lastName: string;

  first_name: string;
  last_name: string;
  phone: string;
  is_email_verified: boolean;
  delivery_day: string;
  stripe_id: string;
  primary_role: string;

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
  code: string;
  email: string;
  name: string;
  users: UserRo[];
  _id: string;
}

export type RegisterUserRo = ApiResponse<AuthRo>;
export type LoginRo = ApiResponse<AuthRo>;
export type VerifyEmailRo = ApiResponse<AuthRo>;
export type RequestVerificationCodeRo = ApiResponse<MessageRo>;
export type RequestPasswordResetRo = ApiResponse<MessageRo>;
export type ResetPasswordRo = ApiResponse<UserRo>;

export type GetUsersRO = HashedDocumentPagination<UserRo[]>;
export type GetReferralsRO = HashedDocumentPagination<ReferralRo[]>;

export type GetUsersRo = PaginatedDocument<UserRo[]>;
