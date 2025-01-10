import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { ComplainsServices } from "./complains.service.js";

const getComplains = catchAsync(async (req, res) => {
  const result = await ComplainsServices.getComplains(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Complain are retrieved successfully",
    data: result,
  });
});

const createComplains = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { complain } = req.body;

  const result = await ComplainsServices.createComplains(id, complain);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Complain has been created successfully",
    data: result,
  });
});

const deleteComplain = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await ComplainsServices.deleteComplain(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Complain is deleted successfully",
    data: result,
  });
});

const approvedComplain = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ComplainsServices.approvedComplain(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Approved review successfully",
    data: result,
  });
});

export const ComplainsController = {
  getComplains,
  createComplains,
  approvedComplain,
  deleteComplain,
};
