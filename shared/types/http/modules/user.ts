import { SafeUser } from "../../models/user";
import { BaseResponse } from "../base";

export interface GetUserResponseBody extends BaseResponse {
  user?: SafeUser;
}

export interface GetUsersResponseBody extends BaseResponse {
  users?: SafeUser[];
  total?: number;
  page?: number;
  totalPages?: number;
}
