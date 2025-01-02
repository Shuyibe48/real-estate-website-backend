import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { AdminServices } from "./admin.service.js";

const getAdmins = catchAsync(async (req, res) => {
  console.log('test', req.user);
  
  const result = await AdminServices.getAdmins(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin is retrieved successfully",
    data: result,
  });
});

const getSingleAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminServices.getSingleAdmin(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin is retrieved successfully",
    data: result,
  });
});

const updateAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { admin } = req.body;
  const result = await AdminServices.updateAdmin(id, admin);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin is updated successfully",
    data: result,
  });
});

const deleteAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminServices.deleteAdmin(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin is deleted successfully",
    data: result,
  });
});

export const AdminController = {
  getAdmins,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin,
};
