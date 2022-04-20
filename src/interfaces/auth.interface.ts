import ApiResponse, { HashedDocumentPagination } from "./apiResponse.interface";
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
  firstName: string;
  lastName: string;
  phone: string;
  emailVerified: boolean;
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
  };
}

// export interface AuthPayload {
//   sub: string;
//   exp: number;
//   roles: string[];
//   email: string;
// }

export interface AuthRo {
  token: string;
  user: UserRo;
}

export interface ResetPasswordDto {
  token: string;
  accountId: string;
  password: string;
}

interface MessageRo {
  message: string;
}

export type RegisterUserRo = ApiResponse<AuthRo>;
export type LoginRo = ApiResponse<AuthRo>;
export type VerifyEmailRo = ApiResponse<AuthRo>;
export type RequestVerificationCodeRo = ApiResponse<MessageRo>;
export type RequestPasswordResetRo = ApiResponse<MessageRo>;
export type ResetPasswordRo = ApiResponse<UserRo>;

export type GetUsersRO = HashedDocumentPagination<UserRo[]>;
