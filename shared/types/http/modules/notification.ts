import { SafeNotification } from "@/types/models/notification";
import { BaseResponse } from "@/types/http/base";

export interface GetNotificationsResponse extends BaseResponse {
  notifications?: SafeNotification[]
}

