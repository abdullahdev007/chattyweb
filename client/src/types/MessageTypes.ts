import { Message } from "@shared/types/models/message";

export type ClientMessage = Message & {
  shouldShake: boolean;
};
