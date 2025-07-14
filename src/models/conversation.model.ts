import mongoose, { Document, Model, Schema } from "mongoose";

interface IParticipant {
  userId: mongoose.Types.ObjectId;
  unreadCount: number;
}

export interface IConversation extends Document {
  participants: IParticipant[];
  messages: mongoose.Types.ObjectId[];
  latestMessage: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const participantSchema = new Schema<IParticipant>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    unreadCount: { type: Number, default: 0 },
  },
  { _id: false }
);

const conversationSchema = new Schema<IConversation>(
  {
    participants: [participantSchema],
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message",
        default: [],
      },
    ],
    latestMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
  },
  { timestamps: true }
);

const Conversation: Model<IConversation> = mongoose.model<IConversation>(
  "Conversation",
  conversationSchema
);

export default Conversation;
