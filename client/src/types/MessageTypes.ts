import { IMessage } from "@shared/types/models/message";

export type ClientMessage = IMessage & { shouldShake: boolean };
