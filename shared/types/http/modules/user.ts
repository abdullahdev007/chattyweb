import { SafeUser } from "@/types/models/user";
import { BaseResponse } from "@/types/http/base";

export interface GetUserResponseBody extends BaseResponse {
  user?: SafeUser
}

export interface GetUsersResponseBody extends BaseResponse {
  users?: SafeUser[]
}