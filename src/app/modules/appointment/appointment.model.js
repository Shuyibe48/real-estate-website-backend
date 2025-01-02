import { model, Schema } from "mongoose";

const appointmentSchema = new Schema(
  {
    propertyAddress: {
      type: String,
      required: [true, "Property address is required"],
    },
    propertyType: {
      type: String,
      enum: ["House", "Apartment", "Commercial"],
      required: [true, "Property type is required"],
    },
    propertyUsage: {
      type: String,
      enum: ["primary", "investment"],
      required: [true, "Property usage is required"],
    },
    appraisalReason: {
      type: String,
      enum: ["selling", "leasing", "bankValuation", "curious"],
      required: [true, "Appraisal reason is required"],
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [/\S+@\S+\.\S+/, "Please provide a valid email address"],
    },
    mobileNumber: {
      type: String,
      required: [true, "Mobile number is required"],
    },
    preferredContactEmail: {
      type: Boolean,
      default: false,
    },
    preferredContactCall: {
      type: Boolean,
      default: false,
    },
    preferredContactSMS: {
      type: Boolean,
      default: false,
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
    date: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);


// query middleware
appointmentSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// query middleware
appointmentSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// query middleware
appointmentSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

export const Appointment = model("Appointment", appointmentSchema);
