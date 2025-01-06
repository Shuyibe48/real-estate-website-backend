import { model, Schema } from "mongoose";

const propertySchema = new Schema(
  {
    id: {
      type: String,
      required: [true, "Property id is required"],
      unique: true,
    },
    agencyId: {
      type: Schema.Types.ObjectId,
      required: [true, "Property uploader agency id is required"],
      ref: "Agency",
    },
    uploaderAgentId: {
      type: Schema.Types.ObjectId,
      required: [true, "Property uploader agent id is required"],
      ref: "Agent",
    },
    title: { type: String, required: [true, "Property title is required"] },
    description: {
      type: String,
      required: [true, "Property description is required"],
    },
    type: {
      type: String,
      enum: ["Buy", "Rent", "Sold"],
      required: [true, "Property type is required"],
    },
    propertyType: {
      type: String,
      required: [true, "Property type is required"],
    },
    price: { type: Number },
    address: {
      type: String,
      required: [true, "Property address is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
    },
    latitude: {
      type: Number,
      required: [true, "Property latitude is required"],
    },
    longitude: {
      type: Number,
      required: [true, "Property longitude is required"],
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
    propertyAge: {
      type: String,
      required: [true, "Property age is required"],
    },
    availableDate: {
      type: Date,
    },
    propertyRequirements: [
      {
        type: String,
        required: [true, "Property requirements is required"],
      },
    ],
    saleMethod: {
      type: String,
      required: [true, "Property sale method is required"],
    },
    outdoorFeatures: [
      {
        type: String,
        required: [true, "Property outdoor features is required"],
      },
    ],
    indoorFeatures: [
      {
        type: String,
        required: [true, "Property indoor features is required"],
      },
    ],
    climateControlAndEnergy: [
      {
        type: String,
        required: [true, "Property climate control and energy is required"],
      },
    ],
    accessibilityFeatures: [
      {
        type: String,
        required: [true, "Property accessibility features is required"],
      },
    ],
    keywords: [
      {
        type: String,
        required: [true, "Property keywords is required"],
      },
    ],
    nearBy: [{ type: String, default: "" }],
    images: [
      {
        type: String,
        required: [true, "Property images is required"],
        default: "",
      },
    ],
    video: {
      type: String,
      require: [true, "Property video is required"],
      default: "",
    },
    // virtualTour: {
    //   type: String,
    //   required: [true, "Property virtualTour is required"],
    // },
    isPromoted: {
      type: Boolean,
      required: [true, "Property isPromoted is required"],
      default: false,
    },
    status: {
      type: String,
      enum: ["in-progress", "blocked"],
      default: "in-progress",
      required: [true, "Property status is required"],
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
    clicks: {
      type: Number,
      required: [true, "Property clicks is required"],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// query middleware
propertySchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// query middleware
propertySchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// query middleware
propertySchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

export const Property = model("Property", propertySchema);
