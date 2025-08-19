import mongoose, { Document, Model, Schema } from "mongoose";
import type { IMessage } from "@shared/types/models/message";

const messageSchema = new Schema<IMessage & Document>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    replayTo: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
  },
  { timestamps: true },
);

const Message: Model<IMessage & Document> = mongoose.model<IMessage & Document>(
  "Message",
  messageSchema,
);

export default Message;
