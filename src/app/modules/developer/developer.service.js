import mongoose from "mongoose";
import { Developer } from "./developer.model.js";
import AppError from "../../errors/AppError.js";
import { User } from "../User/user.model.js";
import httpStatus from "http-status";
import { developerSearchableFields } from "./developer.constant.js";
import QueryBuilder from "../../builder/QueryBuilder.js";

// const getDevelopers = async (query) => {
//   const developerQuery = new QueryBuilder(
//     Developer.find()
//       .populate("userId"),
//     query
//   )
//     .search(developerSearchableFields)
//     .filter()
//     .exactMatch(["address"])
//     .sort()
//     .paginate()
//     .fields();

//   const result = await developerQuery.modelQuery;

//   return result;
// };
const getDevelopers = async (query) => {
  try {
    // QueryBuilder-কে শুরু করা
    const developerQuery = new QueryBuilder(
      Developer.find().populate("userId"), // populate করা `userId` সহ
      query
    )
      .search(developerSearchableFields) // সার্চযোগ্য ফিল্ডের জন্য
      .filter() // ফিল্টারিং
      .exactMatch(["address"]) // exact match জন্য
      .sort() // সাজানোর জন্য
      .paginate() // পেজিনেশন
      .fields(); // প্রয়োজনীয় ফিল্ডস

    // মডেল কুয়েরি চালানো
    const result = await developerQuery.modelQuery;

    return result;
  } catch (error) {
    // ত্রুটি হ্যান্ডলিং
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Error fetching developers.");
  }
};


// const getSingleDeveloper = async (id) => {
//   const result = await Developer.findById(id).populate("projects")
//   return result;
// };
const getSingleDeveloper = async (id) => {
  try {
    // ডেভেলপার তথ্য পাওয়া
    const result = await Developer.findById(id).populate("projects");

    if (!result) {
      // যদি ডেভেলপার না পাওয়া যায়
      throw new AppError(httpStatus.NOT_FOUND, "Developer not found!");
    }

    return result;
  } catch (error) {
    // ত্রুটি হ্যান্ডলিং
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Error fetching developer.");
  }
};



// const updateDeveloper = async (id, payload) => {
//   const { name, ...remainingDeveloperData } = payload;

//   const modifiedUpdatedData = { ...remainingDeveloperData };

//   if (name && Object.keys(name).length) {
//     for (const [key, value] of Object.entries(name)) {
//       modifiedUpdatedData[`name.${key}`] = value;
//     }
//   }

//   const result = await Developer.findByIdAndUpdate(id, modifiedUpdatedData, {
//     new: true,
//     runValidators: true,
//   })
//     .populate("userId")
//   return result;
// };
const updateDeveloper = async (id, payload) => {
  try {
    const { name, ...remainingDeveloperData } = payload;

    const modifiedUpdatedData = { ...remainingDeveloperData };

    // যদি name ফিল্ড থাকে, তবে তাকে সংশোধন করা
    if (name && Object.keys(name).length) {
      for (const [key, value] of Object.entries(name)) {
        modifiedUpdatedData[`name.${key}`] = value;
      }
    }

    // ডেভেলপার আপডেট করা
    const result = await Developer.findByIdAndUpdate(id, modifiedUpdatedData, {
      new: true,
      runValidators: true,
    }).populate("userId");

    if (!result) {
      // যদি ডেভেলপার না পাওয়া যায়
      throw new AppError(httpStatus.NOT_FOUND, "Developer not found!");
    }

    return result;
  } catch (error) {
    // ত্রুটি হ্যান্ডলিং
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Error updating developer.");
  }
};



const deleteDeveloper = async (id) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deletedDeveloper = await Developer.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session }
    );

    if (!deletedDeveloper) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to deleted Developer");
    }

    // get user _id from deletedFaculty
    const userId = deletedDeveloper.userId;

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

    return deletedAgent;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to deleted Developer");
  }
};

// const blockDeveloper = async (id) => {
//   const session = await mongoose.startSession();

//   try {
//     session.startTransaction();

//     const blockedAgent = await Developer.findByIdAndUpdate(
//       id,
//       { blocked: true },
//       { new: true, session }
//     );

//     if (!blockedAgent) {
//       throw new AppError(httpStatus.BAD_REQUEST, "Failed to blocked Developer");
//     }

//     // get user _id from deletedFaculty
//     const userId = blockedAgent.userId;

//     const blockedUser = await User.findByIdAndUpdate(
//       userId,
//       { blocked: true },
//       { new: true, session }
//     );

//     if (!blockedUser) {
//       throw new AppError(httpStatus.BAD_REQUEST, "Failed to blocked user");
//     }

//     await session.commitTransaction();
//     await session.endSession();

//     return blockedAgent;
//   } catch (err) {
//     await session.abortTransaction();
//     await session.endSession();
//     throw new AppError(httpStatus.BAD_REQUEST, "Failed to blocked Developer from here");
//   }
// };


const blockDeveloper = async (id) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Fetch the current developer to check the blocked status
    const developer = await Developer.findById(id).session(session);

    if (!developer) {
      throw new AppError(httpStatus.BAD_REQUEST, "Developer not found");
    }

    // Toggle the blocked status
    const updatedBlockedStatus = !developer.blocked;

    const blockedDeveloper = await Developer.findByIdAndUpdate(
      id,
      { blocked: updatedBlockedStatus }, // Toggle the status
      { new: true, session }
    );

    // If toggling to true, block the user as well
    if (updatedBlockedStatus) {
      const userId = blockedDeveloper.userId;

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

    return blockedAgent;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, "Transaction failed");
  }
};


export const DeveloperServices = {
  getDevelopers,
  getSingleDeveloper,
  updateDeveloper,
  deleteDeveloper,
  blockDeveloper
};
