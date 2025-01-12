import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { PropertyServices } from "./property.service.js";

const createProperty = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { agentId } = req.body;
  const { property } = req.body;

  const result = await PropertyServices.createProperty(id, agentId, property);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Property has been created successfully",
    data: result,
  });
});

const getProperties = catchAsync(async (req, res) => {
  const result = await PropertyServices.getProperties(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Properties are retrieved successfully",
    data: result,
  });
});

const getSingleProperty = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PropertyServices.getSingleProperty(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Property is retrieved successfully",
    data: result,
  });
});

const getPromotedProperty = catchAsync(async (req, res) => {
  const result = await PropertyServices.getPromotedProperty();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Promoted properties are retrieved successfully",
    data: result,
  });
});

const updateProperty = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { property } = req.body;
  const result = await PropertyServices.updateProperty(id, property);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Property is updated successfully",
    data: result,
  });
});

const updatePropertyPromotionStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { isPromoted } = req.body;

  console.log(id, isPromoted);

  const result = await PropertyServices.updatePropertyPromotionStatus(
    id,
    isPromoted
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Property promotion status is updated successfully",
    data: result,
  });
});

const updatePropertyPromotionStatus2 = catchAsync(async (req, res) => {
  const { agencyId } = req.params;

  const result = await PropertyServices.updatePropertyPromotionStatus2(
    agencyId
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Property promotion status is updated successfully",
    data: result,
  });
});

const updatePropertyClicks = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await PropertyServices.updatePropertyClicks(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Property click is updated successfully",
    data: result,
  });
});

const updatePropertyViews = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await PropertyServices.updatePropertyViews(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Property view is updated successfully",
    data: result,
  });
});

const deleteProperty = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await PropertyServices.deleteProperty(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Property is deleted successfully",
    data: result,
  });
});

const markAsSold = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await PropertyServices.markAsSold(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Property type marked as sold successfully",
    data: result,
  });
});

const blockProperty = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PropertyServices.blockProperty(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blocked property successfully",
    data: result,
  });
});

const approvedProperty = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PropertyServices.approvedProperty(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Approved property successfully",
    data: result,
  });
});

const rejectProperty = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PropertyServices.rejectProperty(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reject property successfully",
    data: result,
  });
});

export const PropertyController = {
  createProperty,
  getProperties,
  getSingleProperty,
  getPromotedProperty,
  updateProperty,
  updatePropertyPromotionStatus,
  updatePropertyPromotionStatus2,
  updatePropertyClicks,
  updatePropertyViews,
  deleteProperty,
  markAsSold,
  blockProperty,
  approvedProperty,
  rejectProperty,
};
