import { Schema, model } from "mongoose";

const agentSchema = new Schema(
  {
    id: { type: String, unique: true, required: [true, "Id is required"] },
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, "User id is required"],
      unique: true,
      ref: "User",
    },
    name: {
      firstName: {
        type: String,
        default: "",
      },
      lastName: {
        type: String,
        default: "",
      },
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
    },
    contactNo: { type: String, default: "" },
    myAgency: [
      {
        agency: {
          type: Schema.Types.ObjectId,
          ref: "Agency",
          default: null,
        },
        role: {
          type: String,
          enum: ["agent", "agencyOwner"],
          default: "agent",
        },
      },
    ],
    profileImage: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
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
    properties: [{ type: Schema.Types.ObjectId, ref: "Property", default: "" }],
    clients: [{ type: Schema.Types.ObjectId, ref: "Buyer" }],
    reviews: [{ type: Schema.Types.ObjectId, ref: "Reviews", default: "" }],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// virtual
agentSchema.virtual("fullName").get(function () {
  return this?.name?.firstName + " " + this?.name?.lastName;
});

// query middleware
agentSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// query middleware
agentSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// query middleware
agentSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

// Custom static method
agentSchema.statics.isUserExist = async function (id) {
  const existingUser = await Agent.findOne({ id }); // Use 'this' to refer to the current model
  return existingUser;
};

export const Agent = model("Agent", agentSchema);
