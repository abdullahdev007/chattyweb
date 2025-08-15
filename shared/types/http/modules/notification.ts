import { SafeNotification } from "@shared/types/models/notification";
import { BaseResponse } from "../base";

export interface GetNotificationsResponse extends BaseResponse {
  notifications?: SafeNotification[]
}

