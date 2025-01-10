import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { ReviewsServices } from "./reviews.service.js";

const getReviews = catchAsync(async (req, res) => {
  const result = await ReviewsServices.getReviews(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reviews are retrieved successfully",
    data: result,
  });
});

const updateReview = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { review } = req.body;
  const result = await ReviewsServices.updateReview(id, review);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review is updated successfully",
    data: result,
  });
});

const createReviewsAgent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { reviews } = req.body;

  const result = await ReviewsServices.createReviewsAgent(id, reviews);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reviews has been created successfully",
    data: result,
  });
});

const createReviewsProperty = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { reviews } = req.body;

  const result = await ReviewsServices.createReviewsProperty(id, reviews);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reviews has been created successfully",
    data: result,
  });
});

const deleteReview = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await ReviewsServices.deleteReview(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review is deleted successfully",
    data: result,
  });
});

const approvedReview = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ReviewsServices.approvedReview(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Approved review successfully",
    data: result,
  });
});

const rejectReview = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ReviewsServices.rejectReview(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reject review successfully",
    data: result,
  });
});

export const ReviewsController = {
  getReviews,
  updateReview,
  createReviewsAgent,
  createReviewsProperty,
  approvedReview,
  rejectReview,
  deleteReview,
};
