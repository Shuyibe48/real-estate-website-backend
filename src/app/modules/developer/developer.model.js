import { Schema, model } from "mongoose";

const developerSchema = new Schema(
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
    companyName: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
    },
    contactNo: { type: String, default: "" },
    profileImage: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    licenses: [
      {
        licenseNumber: String,
        issuedBy: String,
        expiryDate: Date,
      },
    ],
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
    projects: [{ type: Schema.Types.ObjectId, ref: "Project", default: "" }],
    clients: [{ type: Schema.Types.ObjectId, ref: "Buyer" }],
    reviews: [
      {
        review: { type: Schema.Types.ObjectId, ref: "Reviews", required: true },
        user: { type: Schema.Types.ObjectId, ref: "Buyer", required: true },
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// virtual
developerSchema.virtual("fullName").get(function () {
  return this?.name?.firstName + " " + this?.name?.lastName;
});

// query middleware
developerSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// query middleware
developerSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// query middleware
developerSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

// Custom static method
developerSchema.statics.isUserExist = async function (id) {
  const existingUser = await Developer.findOne({ id }); // Use 'this' to refer to the current model
  return existingUser;
};

export const Developer = model("Developer", developerSchema);
