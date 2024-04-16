export type APIResponse<Data> = {
  data?: Data | undefined;
  message?: string | undefined;
  action?: string | undefined;
  success: boolean;
};

export type LoginData = {
  account?: Account;
  token?: AuthToken;
};

export type LoginResponse = APIResponse<LoginData>;

export type RegisterResponse = APIResponse<{ email: string }>;

export type VerifyEmailResponse = APIResponse<{ email: string }>;

export type ResendVerificationCodeResponse = APIResponse<{ email: string }>;

export enum Role {
  ADMIN,
  HOST,
  GUEST,
}

export type AuthToken = {
  access: string;
  refresh: string;
};

export type Account = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  phoneNumber: string | null;
  phoneVerified: boolean;
  roles: Role[];
  chatsId: string[];
  profilePhoto: string | null;
  suspended: boolean;
  createdAt: Date;
  updatedAt: Date;
};
