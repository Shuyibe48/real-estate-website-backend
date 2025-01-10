import { model, Schema } from "mongoose";

const projectSchema = new Schema(
  {
    id: {
      type: String,
      required: [true, "Project id is required"],
      unique: true,
    },
    developerId: {
      type: Schema.Types.ObjectId,
      required: [true, "Project developer id is required"],
      ref: "Developer",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    landSize: {
      type: Number,
      required: [true, "Property land size is required"],
    },
    bedrooms: {
      type: Number,
      required: [true, "Property bedrooms is required"],
    },
    bathrooms: {
      type: Number,
      required: [true, "Property bathrooms is required"],
    },
    carSpaces: {
      type: Number,
      required: [true, "Property car spaces is required"],
    },
    price: { type: Number, required: [true, 'Project price is required'] },
    description: {
      type: String,
    },
    // floorPlan: {
    //   type: String,
    //   required: [true, "Project floor plan is required"],
    // },
    images: [
      {
        type: String,
        required: [true, "Project images is required"],
        default: "",
      },
    ],
    isPromoted: {
      type: Boolean,
      required: [true, "Project isPromoted is required"],
      default: false,
    },
    status: {
      type: String,
      enum: ["in-progress", "blocked"],
      default: "in-progress",
      required: [true, "Project status is required"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    reject: {
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
    clicks: {
      type: Number,
      required: [true, "Project clicks is required"],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// query middleware
projectSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// query middleware
projectSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// query middleware
projectSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

export const Project = model("Project", projectSchema);
