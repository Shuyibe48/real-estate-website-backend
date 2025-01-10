import { Reviews } from "./reviews.model.js";
import mongoose from "mongoose";
import httpStatus from "http-status";
import AppError from "../../errors/AppError.js";
import { Agent } from "../agent/agent.model.js";
import { Property } from "../property/property.model.js";
import { reviewSearchableFields } from "./reviews.constant.js";
import QueryBuilder from "../../builder/QueryBuilder.js";

const getReviews = async (query) => {
  const reviewsQuery = new QueryBuilder(Reviews.find().populate("userId"), query)
    .search(reviewSearchableFields) // Partial match for searchable fields
    .filter()
    .exactMatch(["city", "type"]) // `type` এর জন্য exact match এবং `city` এর জন্য partial match
    .sort()
    .paginate()
    .fields();

  const result = await reviewsQuery.modelQuery;

  return result;
};

const updateReview = async (id, payload) => {
  const result = await Reviews.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const createReviewsAgent = async (id, reviews) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // রিভিউ তৈরি করা
    const newReviews = await Reviews.create([reviews], { session });

    if (!newReviews.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create review");
    }

    // রিভিউর ObjectId এবং userId Agent স্কিমার reviews ফিল্ডে যুক্ত করা
    await Agent.findByIdAndUpdate(
      id,
      {
        $addToSet: { reviews: [newReviews[0]._id] },
      },
      { upsert: true, new: true, session }
    );

    await session.commitTransaction();
    await session.endSession();
    return newReviews[0];
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, err.message || err);
  }
};

const createReviewsProperty = async (id, reviews) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // রিভিউ তৈরি করা
    const newReviews = await Reviews.create([reviews], { session });

    if (!newReviews.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create review");
    }

    await Property.findByIdAndUpdate(
      id,
      {
        $addToSet: { reviews: [newReviews[0]._id] },
      },
      { upsert: true, new: true, session }
    );

    await session.commitTransaction();
    await session.endSession();
    return newReviews[0];
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, err.message || err);
  }
};

const deleteReview = async (id) => {
  try {
    const deletedReview = await Reviews.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!deletedReview) {
      throw new AppError(httpStatus.NOT_FOUND, "Review not found");
    }

    return deletedReview;
  } catch (err) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "An error occurred while deleting the Review"
    );
  }
};

const approvedReview = async (id) => {
  try {
    const review = await Reviews.findById(id);

    if (!review) {
      throw new AppError(httpStatus.BAD_REQUEST, "Review not found");
    }

    // Toggle the approved status
    const updatedApprovedStatus = !review.approved;

    const approvedReview = await Reviews.findByIdAndUpdate(
      id,
      { approved: updatedApprovedStatus },
      { new: true }
    );

    return approvedReview;
  } catch (err) {
    throw new AppError(httpStatus.BAD_REQUEST, "Approved review failed");
  }
};

const rejectReview = async (id) => {
  try {
    const review = await Reviews.findById(id);

    if (!review) {
      throw new AppError(httpStatus.BAD_REQUEST, "Review not found");
    }

    // Toggle the reject status
    const updatedRejectStatus = !review.reject;

    const rejectReview = await Reviews.findByIdAndUpdate(
      id,
      { reject: updatedRejectStatus },
      { new: true }
    );

    return rejectReview;
  } catch (err) {
    throw new AppError(httpStatus.BAD_REQUEST, "Reject review failed");
  }
};

export const ReviewsServices = {
  getReviews,
  updateReview,
  createReviewsAgent,
  createReviewsProperty,
  deleteReview,
  approvedReview,
  rejectReview,
};
