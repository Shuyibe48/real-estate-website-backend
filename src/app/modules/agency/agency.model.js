import { Schema, model, Types } from "mongoose";

const agencySchema = new Schema(
  {
    id: {
      type: String,
      unique: true,
      required: [true, "Agency id is required"],
    },
    name: {
      type: String,
      required: [true, "Agency name is required"],
      unique: true,
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      unique: true,
      required: [true, "Agent is required"],
      ref: "Agent",
    },
    member: [
      {
        agent: {
          type: Schema.Types.ObjectId,
          ref: "Agent",
          unique: true,
          default: null,
        },
        role: {
          type: String,
          enum: ["agent", "agencyOwner"],
          default: "agent",
        },
      },
    ],
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
    },
    contactNo: { type: String, required: [true, "Contact is required"] },
    logo: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    description: {
      type: String,
      default: "",
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
    status: {
      type: String,
      enum: ["in-progress", "blocked"],
      default: "in-progress",
    },
    properties: [{ type: Schema.Types.ObjectId, ref: "Property" }],
    clients: [{ type: Schema.Types.ObjectId, ref: "Buyer" }],
    payments: [{ type: Schema.Types.ObjectId, ref: "Payment" }],
    promotedPlan: {
      planId: { type: Schema.Types.ObjectId, ref: "Plan" }, 
      startDate: { type: Date },
      endDate: { type: Date },
    },
    reviews: [
      {
        review: { type: Schema.Types.ObjectId, ref: "Reviews", required: true },
        user: { type: Schema.Types.ObjectId, ref: "Buyer", required: true },
      },
    ],
  },
  {
    timestamps: true,
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// query middleware
agencySchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// query middleware
agencySchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// query middleware
agencySchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

// Custom static method
agencySchema.statics.isUserExist = async function (id) {
  const existingUser = await Agency.findOne({ id }); // Use 'this' to refer to the current model
  return existingUser;
};

export const Agency = model("Agency", agencySchema);
