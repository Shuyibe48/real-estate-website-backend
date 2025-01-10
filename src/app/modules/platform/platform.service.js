import httpStatus from "http-status";
import AppError from "../../errors/AppError.js";
import { Platforms } from "./platform.model.js";

const getPlatforms = async (query) => {
  const result = await Platforms.find();
  return result;
};

const updatePlatform = async (id, payload) => {
  const result = await Platforms.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

export const PlatformsServices = {
  getPlatforms,
  updatePlatform,
};
