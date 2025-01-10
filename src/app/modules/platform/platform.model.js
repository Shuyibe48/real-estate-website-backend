import { model, Schema } from "mongoose";

const platformsSchema = new Schema(
  {
    platform: {
      type: String,
      required: [true, "Logo is required"],
      default: "platform",
    },
    logo: {
      type: String,
      required: [true, "Logo is required"],
    },
    banner: {
      type: String,
      required: [true, "Banner is required"],
    },
  },
  {
    timestamps: true,
  }
);

export const Platforms = model("Platforms", platformsSchema);
