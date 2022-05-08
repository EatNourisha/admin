export type {
  RegisterUserDto,
  RegisterUserRo,
  VerifyEmailDto,
  VerifyEmailRo,
  RequestPasswordResetDto,
  RequestVerificationCodeRo,
  RequestPasswordResetRo,
  ResetPasswordDto,
  ResetPasswordRo,
  LoginDto,
  LoginRo,
  AuthRo,
  UserRo,
  GetUsersRO,
  UpdateProfileDto,
} from "./auth.interface";
export type { default as AppStatus } from "./appStatus.type";
export type { default as ErrorType } from "./errorType.type";

export type {
  default as ApiResponse,
  PaginatedDocument,
  HashedDocumentPagination,
} from "./apiResponse.interface";

export type {
  AppointmentRO,
  GetAppointmentsRO,
  AppointmentStatsRO,
} from "./appointments.interface";

export { ConsultationType, MeansOfContact } from "./appointments.interface";

export type { default as PageProps } from "./pageProps.interface";

export type { DashboardRo } from "./dashboard.interface";
