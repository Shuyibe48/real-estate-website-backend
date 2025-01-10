import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { PlatformsServices } from "./platform.service.js";

const getPlatforms = catchAsync(async (req, res) => {
  const result = await PlatformsServices.getPlatforms(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Platform are retrieved successfully",
    data: result,
  });
});

const updatePlatform = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { platform } = req.body;
  const result = await PlatformsServices.updatePlatform(id, platform);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Platform is updated successfully",
    data: result,
  });
});

export const PlatformsController = {
  getPlatforms,
  updatePlatform,
};
