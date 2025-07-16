export interface ChangePasswordParams {
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
  error?: string;
}

export interface DeleteAccountResponse {
  error?: string;
}

export interface LoginResponse {
  error?: string;
  [key: string]: any;
}

export interface LoginInput {
  username: string;
  password: string;
}

export interface LogoutResponse {
  error?: string;
}

export interface SignupInput {
  fullName: string;
  username: string;
  password: string;
  confirmPassword: string;
  gender: string;
}

export interface SignupResponse {
  error?: string;
  [key: string]: any;
}

export interface UpdateProfileInput {
  fullName: string;
  username: string;
  gender: string;
}

export interface UpdateProfileResponse {
  error?: string;
  [key: string]: any;
}
