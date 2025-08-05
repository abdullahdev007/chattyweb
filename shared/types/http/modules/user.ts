import { SafeUser } from "@shared/types/models/user";
import { BaseResponse } from "../base";

export interface GetUserResponseBody extends BaseResponse {
  user?: SafeUser
}

export interface GetUsersResponseBody extends BaseResponse {
  users?: SafeUser[]
}