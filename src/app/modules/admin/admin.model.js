import { Schema, model } from "mongoose";

const adminSchema = new Schema(
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
        required: [true, "First name is required"],
      },
      lastName: {
        type: String,
        required: [true, "Last name is required"],
      },
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    profileImg: { type: String, default: "" },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// generating full name
adminSchema.virtual("fullName").get(function () {
  return this?.name?.firstName + " " + this?.name?.lastName;
});

// filter out deleted documents
adminSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

adminSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

adminSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

//checking if user is already exist!
adminSchema.statics.isUserExists = async function (id) {
  const existingUser = await Admin.findOne({ id });
  return existingUser;
};

export const Admin = model("Admin", adminSchema);
