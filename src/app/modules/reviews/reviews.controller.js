import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { ReviewsServices } from "./reviews.service.js";

const createReviewsAgent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { agentId } = req.body;
  const { reviews } = req.body;

  console.log("userId: ", id);
  console.log("agentId:", agentId);
  console.log(reviews);

  const result = await ReviewsServices.createReviewsAgent(id, agentId, reviews);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reviews has been created successfully",
    data: result,
  });
});

const createReviewsAgency = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { agencyId } = req.body;
  const { reviews } = req.body;

  const result = await ReviewsServices.createReviewsAgency(
    id,
    agencyId,
    reviews
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reviews has been created successfully",
    data: result,
  });
});

export const ReviewsController = {
  createReviewsAgent,
  createReviewsAgency,
};
