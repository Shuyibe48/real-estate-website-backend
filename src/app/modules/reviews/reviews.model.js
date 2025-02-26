import { model, Schema } from "mongoose";

const reviewsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Buyer",
      required: true,
    },
    id: {
      type: String,
      required: [true, "Reviewer id is required"],
    },
    toId: {
      type: String,
      required: [true, "Reviewer to id is required"],
    },
    name: {
      type: String,
      required: [true, "Reviewer name is required"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
    },
    reviews: {
      type: String,
      required: [true, "Reviews comment is required"],
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
    blocked: {
      type: Boolean,
      default: false,
    },
    approved: {
      type: Boolean,
      default: false,
    },
    reject: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);


// query middleware
reviewsSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// query middleware
reviewsSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// query middleware
reviewsSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

export const Reviews = model("Reviews", reviewsSchema);
