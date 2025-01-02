import { model, Schema } from "mongoose";

const chatSchema = new Schema(
  {
    participants: [
      { type: Schema.Types.ObjectId, ref: "User", required: true },
    ],
    messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
    status: {
      type: String,
      enum: ["in-progress", "blocked"],
      default: "in-progress",
      required: [true, "Chat status is required"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Chat = model("Chat", chatSchema);

const messageSchema = new Schema(
  {
    text: { type: String, required: true },
    senderId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  },
  {
    timestamps: true,
  }
);

export const Message = model("Message", messageSchema);
