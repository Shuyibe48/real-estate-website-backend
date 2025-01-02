import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { PlanServices } from "./plan.service.js";

const createPlan = catchAsync(async (req, res) => {
  const { formattedData } = req.body;

  const result = await PlanServices.createPlan(formattedData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Plan has been created successfully",
    data: result,
  });
});

const getPlan = catchAsync(async (req, res) => {
  const result = await PlanServices.getPlan();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Plan is retrieved successfully",
    data: result,
  });
});

const updatePlan = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  const result = await PlanServices.updatePlan(id, updatedData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Plan is updated successfully",
    data: result,
  });
});

const deletePlan = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PlanServices.deletePlan(id); // Soft delete using isDeleted
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Plan is deleted successfully",
    data: result,
  });
});

export const PlanController = {
  createPlan,
  getPlan,
  updatePlan,
  deletePlan,
};
