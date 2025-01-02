import { model, Schema } from "mongoose";

const reviewsSchema = new Schema(
  {
    rating: {
      type: Number,
      required: [true, "Rating is required"],
    },
    comment: {
      type: String,
      required: [true, "Reviews comment is required"],
    },
    role: {
      type: String,
      enum: ["Buyer", "Seller"],
      required: [true, "Reviews role is required"],
    },
    status: {
      type: String,
      enum: ["in-progress", "blocked"],
      default: "in-progress",
      required: [true, "Reviews status is required"],
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

export const Reviews = model("Reviews", reviewsSchema);
