import mongoose from "mongoose";
import { Admin } from "./admin.model.js";
import AppError from "../../errors/AppError.js";
import { User } from "../User/user.model.js";
import httpStatus from "http-status";
import { adminSearchableFields } from "./admin.constant.js";
import QueryBuilder from "../../builder/QueryBuilder.js";

const getAdmins = async (query) => {
  const adminQuery = new QueryBuilder(Admin.find(), query)
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

export const AdminServices = {
  getAdmins,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin,
};
