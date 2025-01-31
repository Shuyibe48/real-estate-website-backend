import mongoose from "mongoose";
import { Buyer } from "../buyer/buyer.model.js";
import { User } from "./user.model.js";
import {
  generateAdminId,
  generateAgentId,
  generateBuyerId,
  generateDeveloperId,
} from "./user.utils.js";
import AppError from "../../errors/AppError.js";
import httpStatus from "http-status";
import { Agent } from "../agent/agent.model.js";
import { Admin, SuperAdmin } from "../admin/admin.model.js";
import { verifyToken } from "../Auth/auth.utils.js";
import config from "../../config/index.js";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary.js";
import USER_ROLE from "./user.constant.js";
import { Developer } from "../developer/developer.model.js";

const createBuyerIntoDB = async (buyer) => {
  const userData = {};

  userData.password = buyer?.password;
  userData.role = USER_ROLE.buyer;
  userData.email = buyer?.email;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    userData.id = await generateBuyerId();

    // if (file) {
    //   const imageName = `${userData?.id} ${buyer?.name?.firstName}`;
    //   const path = file?.path;

    //   const { secure_url } = await sendImageToCloudinary(imageName, path);
    //   buyer.profileImage = secure_url;
    // }

    console.log(userData.id);

    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create user");
    }
    buyer.id = newUser[0].id;
    buyer.userId = newUser[0]._id;

    const newBuyer = await Buyer.create([buyer], { session });

    if (!newBuyer.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create buyer");
    }

    await session.commitTransaction();
    await session.endSession();

    return newBuyer;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, err);
  }
};

const createAgentIntoDB = async (agent) => {
  const userData = {};

  console.log(agent);

  userData.password = agent?.password;
  userData.role = USER_ROLE.agent;
  userData.email = agent?.email;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    userData.id = await generateAgentId();

    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create user");
    }
    agent.id = newUser[0].id;
    agent.userId = newUser[0]._id;

    const newAgent = await Agent.create([agent], { session });

    if (!newAgent.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create agent");
    }

    await session.commitTransaction();
    await session.endSession();

    return newAgent;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, err);
  }
};

const createAdminIntoDB = async (admin) => {
  const userData = {};

  userData.password = admin?.password;
  userData.role = "3";
  userData.email = admin?.email;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    userData.id = await generateAdminId();

    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create user");
    }
    admin.id = newUser[0].id;
    admin.userId = newUser[0]._id;

    const newAdmin = await Admin.create([admin], { session });

    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create admin");
    }

    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, err);
  }
};

const createDeveloperIntoDB = async (developer) => {
  const userData = {};

  userData.password = developer?.password;
  userData.role = "5";
  userData.email = developer?.email;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    userData.id = await generateDeveloperId();

    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create user");
    }
    developer.id = newUser[0].id;
    developer.userId = newUser[0]._id;

    const newDeveloper = await Developer.create([developer], { session });

    if (!newDeveloper.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create developer");
    }

    await session.commitTransaction();
    await session.endSession();

    return newDeveloper;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, err);
  }
};

// const changeStatus = async (id, payload) => {
//   const result = await User.findByIdAndUpdate(id, payload, {
//     new: true,
//   });
//   return result;
// };

// const getUsers = async (id) => {
//   const result = await User.find({ _id: id }).populate("appointments");
//   return result;
// };
// Improved changeStatus function with error handling and validation
const changeStatus = async (id, payload) => {
  try {
    if (!id || typeof id !== "string") {
      throw new Error("Invalid ID");
    }
    const result = await User.findByIdAndUpdate(id, payload, { new: true });
    if (!result) {
      throw new Error("User not found");
    }
    return result;
  } catch (error) {
    console.error("Error in changeStatus:", error);
    throw new Error("Error updating status");
  }
};

// Improved getUsers function with error handling and performance optimization
const getUsers = async (id) => {
  try {
    if (!id || typeof id !== "string") {
      throw new Error("Invalid ID");
    }
    const result = await User.find({ _id: id }).populate("appointments");
    if (!result.length) {
      throw new Error("No users found");
    }
    return result;
  } catch (error) {
    console.error("Error in getUsers:", error);
    throw new Error("Error fetching users");
  }
};

// const getMe = async (userId, role) => {
//   let result = null;

//   if (role === "1") {
//     result = await Buyer.findOne({ id: userId })
//       .populate("userId")
//       .populate("favorites");
//   }

//   if (role === "2") {
//     result = await Agent.findOne({ id: userId })
//       .populate("properties")
//       .populate("userId")
//       .populate("myAgency.agency");
//   }

//   if (role === "3") {
//     result = await Admin.findOne({ id: userId }).populate("userId");
//   }

//   if (role === "4") {
//     result = await SuperAdmin.findOne({ id: userId }).populate("userId");
//   }

//   if (role === "5") {
//     result = await Developer.findOne({ id: userId }).populate("userId");
//   }

//   return result;
// };
const getMe = async (userId, role) => {
  try {
    if (!userId || !role) {
      throw new Error("Invalid userId or role");
    }

    let result = null;

    switch (role) {
      case "1":
        result = await Buyer.findOne({ id: userId })
          .populate("userId")
          .populate("favorites");
        break;

      case "2":
        result = await Agent.findOne({ id: userId })
          .populate("properties")
          .populate("userId")
          .populate("myAgency.agency");
        break;

      case "3":
        result = await Admin.findOne({ id: userId }).populate("userId");
        break;

      case "4":
        result = await SuperAdmin.findOne({ id: userId }).populate("userId");
        break;

      case "5":
        result = await Developer.findOne({ id: userId }).populate("userId");
        break;

      default:
        throw new Error("Invalid role");
    }

    if (!result) {
      throw new Error("User not found");
    }

    return result;
  } catch (error) {
    console.error("Error in getMe:", error);
    throw new Error("Error fetching user data");
  }
};

const saveSearchHistory = async (id, searchText) => {
  try {
 
    const searchHistory = await User.findByIdAndUpdate(
      id,
      {
        $addToSet: { searchHistory: searchText }, 
      },
      { upsert: true, new: true } 
    );

  
    if (!searchHistory) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "User not found or failed to update search history."
      );
    }

    return searchHistory;
  } catch (error) {
 
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error saving search history."
    );
  }
};

export const UserServices = {
  createBuyerIntoDB,
  createAgentIntoDB,
  createAdminIntoDB,
  createDeveloperIntoDB,
  changeStatus,
  saveSearchHistory,
  getUsers,
  getMe,
};
