import { model, Schema } from "mongoose";

const paymentSchema = new Schema(
  {
    plan: {
      type: Object,
      required: [true, "Plan is required"],
    },
    agency: {
      type: Object,
      required: [true, "Agency is required"],
    },
    sessionId: {
      type: String,
      required: [true, "Session id is required"],
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    paymentIntentId: {
      type: String,
    },
    paymentMethod: {
      type: Object, // Store details like type, brand, last4, etc.
    },
    status: {
      type: String,
      enum: ["in-progress", "blocked"],
      default: "in-progress",
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

export const Payment = model("Payment", paymentSchema);
