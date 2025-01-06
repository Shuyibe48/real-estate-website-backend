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
      ref: "Agency",
    },
    projectName: {
        type: String,
        required: true,
        trim: true
    },
    projectType: {
        type: String,
        enum: ['Residential', 'Commercial', 'Mixed-Use'],
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['Ongoing', 'Completed', 'Upcoming'],
        default: 'Upcoming'
    },
    developer: {
        type: Schema.Types.ObjectId,
        ref: 'Developer',
        required: true
    },
    location: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    budget: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    images: [
      {
        type: String,
        required: [true, "Project images is required"],
        default: "",
      },
    ],
    // video: {
    //   type: String,
    //   require: [true, "Project video is required"],
    //   default: "",
    // },
    // virtualTour: {
    //   type: String,
    //   required: [true, "Project virtualTour is required"],
    // },
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
