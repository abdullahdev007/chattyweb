import mongoose, { Document, Model, Schema } from "mongoose";
import type {
  IParticipant,
  IConversation,
} from "@shared/types/models/conversation";

const participantSchema = new Schema<IParticipant>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    unreadCount: { type: Number, default: 0 },
  },
  { _id: false },
);

const conversationSchema = new Schema<IConversation & Document>(
  {
    participants: [participantSchema],
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message",
        default: [],
      },
    ],
  },
  { timestamps: true },
);

const Conversation: Model<IConversation & Document> = mongoose.model<
  IConversation & Document
>("Conversation", conversationSchema);

export default Conversation;
