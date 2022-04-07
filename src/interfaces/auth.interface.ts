import ApiResponse from "./apiResponse.interface";

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
  middleName: string;
  lastName: string;
  phone: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  userName: string;
  primaryRole: string;
  refCode: string;
  control: {
    enabled: boolean;
  };
  vote: {
    next: string;
    last: string;
  };
}

export interface AuthPayload {
  sub: string;
  exp: number;
  roles: string[];
  email: string;
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

export type RegisterUserRo = ApiResponse<AuthRo>;
export type LoginRo = ApiResponse<AuthRo>;
export type VerifyEmailRo = ApiResponse<AuthRo>;
export type RequestVerificationCodeRo = ApiResponse<MessageRo>;
export type RequestPasswordResetRo = ApiResponse<MessageRo>;
export type ResetPasswordRo = ApiResponse<UserRo>;
