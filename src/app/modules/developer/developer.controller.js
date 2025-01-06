import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { DeveloperServices } from "./developer.service.js";

const getDevelopers = catchAsync(async (req, res) => {
  const result = await DeveloperServices.getDevelopers(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Developer is retrieved successfully",
    data: result,
  });
});

const getSingleDeveloper = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await DeveloperServices.getSingleDeveloper(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Developer is retrieved successfully",
    data: result,
  });
});

const updateDeveloper = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { developer } = req.body;
  const result = await DeveloperServices.updateDeveloper(id, developer);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Developer is updated successfully",
    data: result,
  });
});

const deleteDeveloper = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await DeveloperServices.deleteDeveloper(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Developer is deleted successfully",
    data: result,
  });
});

const blockDeveloper = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await DeveloperServices.blockDeveloper(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Developer is blocked successfully",
    data: result,
  });
});

export const DeveloperController = {
  getDevelopers,
  getSingleDeveloper,
  updateDeveloper,
  deleteDeveloper,
  blockDeveloper,
};
