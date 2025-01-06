import mongoose from "mongoose";
import { Buyer } from "./buyer.model.js";
import AppError from "../../errors/AppError.js";
import { User } from "../User/user.model.js";
import httpStatus from "http-status";
import { buyerSearchableFields } from "./buyer.constant.js";
import QueryBuilder from "../../builder/QueryBuilder.js";

const getBuyers = async (query) => {
  const buyerQuery = new QueryBuilder(Buyer.find().populate("userId"), query)
    .search(buyerSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await buyerQuery.modelQuery;

  return result;
};

const getSingleBuyers = async (id) => {
  const result = await Buyer.findById(id);
  return result;
};

const updateBuyer = async (id, payload) => {
  const { name, ...remainingBuyerData } = payload;

  const modifiedUpdatedData = { ...remainingBuyerData };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  const result = await Buyer.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  })
    .populate("userId")
    .populate("favorites");
  return result;
};

const deleteBuyer = async (id) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deletedBuyer = await Buyer.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session }
    );

    if (!deletedBuyer) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to deleted Buyer");
    }

    // get user _id from deletedAdmin
    const userId = deletedBuyer.userId;

    const deletedUser = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session }
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to deleted user");
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedBuyer;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to deleted Buyer");
  }
};

const saveFavoriteProperty = async (id, propertyId) => {
  const favoriteProperty = await Buyer.findByIdAndUpdate(
    id,
    {
      $addToSet: { favorites: propertyId },
    },
    { upsert: true, new: true }
  )
    .populate("userId")
    .populate("favorites");

  return favoriteProperty;
};

const deleteFavoriteProperty = async (id, propertyId) => {
  const favoriteProperty = await Buyer.findByIdAndUpdate(
    id,
    {
      $pull: { favorites: propertyId },
    },
    { new: true }
  )
    .populate("userId")
    .populate("favorites");

  return favoriteProperty;
};

const saveSearchHistory = async (id, searchText) => {
  const searchHistory = await Buyer.findByIdAndUpdate(
    id,
    {
      $addToSet: { searchHistory: searchText },
    },
    { upsert: true, new: true }
  );

  return searchHistory;
};

const blockBuyer = async (id) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Fetch the current buyer to check the blocked status
    const buyer = await Buyer.findById(id).session(session);

    if (!buyer) {
      throw new AppError(httpStatus.BAD_REQUEST, "Buyer not found");
    }

    // Toggle the blocked status
    const updatedBlockedStatus = !buyer.blocked;

    const blockedBuyer = await Buyer.findByIdAndUpdate(
      id,
      { blocked: updatedBlockedStatus }, // Toggle the status
      { new: true, session }
    );

    // If toggling to true, block the user as well
    if (updatedBlockedStatus) {
      const userId = blockedBuyer.userId;

      const blockedUser = await User.findByIdAndUpdate(
        userId,
        { blocked: true },
        { new: true, session }
      );

      if (!blockedUser) {
        throw new AppError(httpStatus.BAD_REQUEST, "Failed to block user");
      }
    }

    await session.commitTransaction();
    await session.endSession();

    return blockedBuyer;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, "Transaction failed");
  }
};

export const BuyerServices = {
  getBuyers,
  getSingleBuyers,
  updateBuyer,
  deleteBuyer,
  saveFavoriteProperty,
  deleteFavoriteProperty,
  saveSearchHistory,
  blockBuyer,
};
