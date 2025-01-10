import { model, Schema } from "mongoose";

const complainsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Buyer",
      required: true,
    },
    id: {
      type: String,
      required: [true, "Complainer id is required"],
    },
    toId: {
      type: String,
      required: [true, "Complain to id is required"],
    },
    name: {
      type: String,
      required: [true, "Complainer name is required"],
    },
    complain: {
      type: String,
      required: [true, "Complain comment is required"],
    },
    status: {
      type: String,
      enum: ["in-progress", "blocked"],
      default: "in-progress",
      required: [true, "Complain status is required"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    approved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);


// query middleware
complainsSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// query middleware
complainsSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// query middleware
complainsSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

export const Complains = model("Complains", complainsSchema);
