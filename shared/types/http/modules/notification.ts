import { SafeNotification } from "../../models/notification";
import { BaseResponse } from "../base";

export interface GetNotificationsResponse extends BaseResponse {
  notifications?: SafeNotification[];
  pagination?: {
    total: number;
    page: number;
    totalPages: number;
  }
}

// to use pagination with get notifications route
export interface GetNotificationsQuery {
  page?: number;
}
