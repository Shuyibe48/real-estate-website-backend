import httpStatus from "http-status";
import AppError from "../../errors/AppError.js";
import { Platforms } from "./platform.model.js";

// const getPlatforms = async (query) => {
//   const result = await Platforms.find();
//   return result;
// };

// const updatePlatform = async (id, payload) => {
//   const result = await Platforms.findByIdAndUpdate(id, payload, {
//     new: true,
//     runValidators: true,
//   });
//   return result;
// };


const getPlatforms = async (query) => {
  try {
    const result = await Platforms.find(query); // filter/query added if needed

    if (!result || result.length === 0) {
      throw new AppError(httpStatus.NOT_FOUND, "No platforms found.");
    }

    return result;
  } catch (error) {
    // Error handling
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Error fetching platforms.");
  }
};

const updatePlatform = async (id, payload) => {
  try {
    const result = await Platforms.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    if (!result) {
      throw new AppError(httpStatus.NOT_FOUND, "Platform not found.");
    }

    return result;
  } catch (error) {
    // Error handling
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Error updating platform.");
  }
};


export const PlatformsServices = {
  getPlatforms,
  updatePlatform,
};
