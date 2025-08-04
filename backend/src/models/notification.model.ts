import mongoose, { Document, Model, Schema } from "mongoose";
import type { INotification } from "@shared/types/models/notification";

const notificationSchema = new Schema<INotification & Document>(
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
    type: { type: String, required: true },
    readed: { type: Boolean, default: false },
    message: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const Notification: Model<INotification & Document> = mongoose.model<
  INotification & Document
>("Notification", notificationSchema);

export default Notification;
