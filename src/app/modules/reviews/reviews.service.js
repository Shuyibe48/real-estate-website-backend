import { Reviews } from "./reviews.model.js";
import mongoose from "mongoose";
import httpStatus from "http-status";
import AppError from "../../errors/AppError.js";
import { Agent } from "../agent/agent.model.js";
import { Agency } from "../agency/agency.model.js";

const createReviewsAgent = async (userId, agentId, reviews) => {
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
      agentId,
      {
        $addToSet: {
          reviews: {
            review: newReviews[0]._id, // রিভিউর ObjectId
            user: userId,             // ইউজারের ObjectId
          },
        },
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


const createReviewsAgency = async (userId, agencyId, reviews, ) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // রিভিউ তৈরি করা
    const newReviews = await Reviews.create([reviews], { session });

    if (!newReviews.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create review");
    }

    // রিভিউর ObjectId এবং userId Agent স্কিমার reviews ফিল্ডে যুক্ত করা
    await Agency.findByIdAndUpdate(
      agencyId,
      {
        $addToSet: {
          reviews: {
            review: newReviews[0]._id, // রিভিউর ObjectId
            user: userId,             // ইউজারের ObjectId
          },
        },
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

export const ReviewsServices = {
  createReviewsAgent,
  createReviewsAgency,
};
