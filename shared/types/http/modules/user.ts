import { SafeUser } from "../../models/user";
import { BaseResponse } from "../base";

export interface GetUserResponseBody extends BaseResponse {
  user?: SafeUser;
}

export interface GetUsersResponseBody extends BaseResponse {
  users?: SafeUser[];
  pagination?: {
    total: number;
    page: number;
    totalPages: number;
    
  }
}

// to use pagination with get users route
export interface GetUsersQuery {
  page?: number
}