import { SafeUser } from "@shared/types/models/user";
import type { Gender } from "../../types";
import type { BaseResponse } from "../base";

export interface SignupRequestBody {
  fullName: string;
  username: string;
  password: string;
  confirmPassword: string;
  gender: Gender;
}

export interface SignupResponseBody extends BaseResponse {
  user?: SafeUser;
}

export interface LoginRequestBody {
  username: string;
  password: string;
}

export interface LoginResponseBody extends BaseResponse {
  user?: SafeUser
}

export interface ChangePasswordRequestBody {
  password: string;
  confirmPassword: string;
}

export interface UpdateProfileRequestBody {
  fullName: string;
  username: string;
  gender: Gender;
}

export interface UpdateProfileResponseBody extends BaseResponse {
  user?: any
}
