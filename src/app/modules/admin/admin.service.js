import mongoose from "mongoose";
import { Admin } from "./admin.model.js";
import AppError from "../../errors/AppError.js";
import { User } from "../User/user.model.js";
import httpStatus from "http-status";
import { adminSearchableFields } from "./admin.constant.js";
import QueryBuilder from "../../builder/QueryBuilder.js";

const getAdmins = async (query) => {
  const adminQuery = new QueryBuilder(Admin.find().populate("userId"), query)
    .search(adminSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await adminQuery.modelQuery;

  return result;
};

const getSingleAdmin = async (id) => {
  const result = await Admin.findById(id);
  return result;
};

const updateAdmin = async (id, payload) => {
  const { name, ...remainingAdminData } = payload;

  const modifiedUpdatedData = { ...remainingAdminData };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  const result = await Admin.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });
  return result;
};

const updatePermission = async (payload) => {
  // সকল অ্যাডমিনের পারমিশন আপডেট করতে
  const result = await Admin.updateMany(
    {}, // সব অ্যাডমিনকে নির্বাচন করার জন্য খালি অবজেক্ট
    {
      $set: {
        // শুধুমাত্র পারমিশন আপডেট হবে
        "permission.viewProperties": payload.permission.viewProperties,
        "permission.editProperties": payload.permission.editProperties,
        "permission.deleteProperties": payload.permission.deleteProperties,
        "permission.manageUsers": payload.permission.manageUsers,
        "permission.viewReports": payload.permission.viewReports,
      },
    },
    {
      new: true, // নতুন ডাটা রিটার্ন করতে
      runValidators: true, // ভ্যালিডেশন রান করতে
    }
  );

  return result;
};

const deleteAdmin = async (id) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deletedAdmin = await Admin.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session }
    );

    if (!deletedAdmin) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to deleted Admin");
    }

    // get user _id from deletedAdmin
    const userId = deletedAdmin.userId;

    const deletedUser = await User.findOneAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session }
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to deleted user");
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedAdmin;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to deleted Admin");
  }
};

const blockAdmin = async (id) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Fetch the current admin to check the blocked status
    const admin = await Admin.findById(id).session(session);

    if (!admin) {
      throw new AppError(httpStatus.BAD_REQUEST, "Admin not found");
    }

    // Toggle the blocked status
    const updatedBlockedStatus = !admin.blocked;

    const blockedAdmin = await Admin.findByIdAndUpdate(
      id,
      { blocked: updatedBlockedStatus }, // Toggle the status
      { new: true, session }
    );

    // If toggling to true, block the user as well
    if (updatedBlockedStatus) {
      const userId = blockedAdmin.userId;

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

export const AdminServices = {
  getAdmins,
  getSingleAdmin,
  updateAdmin,
  updatePermission,
  deleteAdmin,
  blockAdmin,
};
