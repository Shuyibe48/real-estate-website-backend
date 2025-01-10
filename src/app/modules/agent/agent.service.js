import mongoose from "mongoose";
import { Agent } from "./agent.model.js";
import AppError from "../../errors/AppError.js";
import { User } from "../User/user.model.js";
import httpStatus from "http-status";
import { agentSearchableFields } from "./agent.constant.js";
import QueryBuilder from "../../builder/QueryBuilder.js";

const getAgents = async (query) => {
  const agentQuery = new QueryBuilder(
    Agent.find()
      .populate("userId")
      .populate("myAgency.agency")
      .populate("properties"),
    query
  )
    .search(agentSearchableFields)
    .filter()
    .exactMatch(["address"])
    .sort()
    .paginate()
    .fields();

  const result = await agentQuery.modelQuery;

  return result;
};

const getSingleAgent = async (id) => {
  const result = await Agent.findById(id)
    .populate("reviews")
    .populate("myAgency.agency")
    .populate("properties");
  return result;
};

const updateAgent = async (id, payload) => {
  const { name, ...remainingAgentData } = payload;

  const modifiedUpdatedData = { ...remainingAgentData };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  const result = await Agent.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  })
    .populate("userId")
    .populate("myAgency.agency");
  return result;
};

const deleteAgent = async (id) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deletedAgent = await Agent.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session }
    );

    if (!deletedAgent) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to deleted Agent");
    }

    // get user _id from deletedFaculty
    const userId = deletedAgent.userId;

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
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to deleted Agent");
  }
};

// const blockAgent = async (id) => {
//   const session = await mongoose.startSession();

//   try {
//     session.startTransaction();

//     const blockedAgent = await Agent.findByIdAndUpdate(
//       id,
//       { blocked: true },
//       { new: true, session }
//     );

//     if (!blockedAgent) {
//       throw new AppError(httpStatus.BAD_REQUEST, "Failed to blocked Agent");
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
//     throw new AppError(httpStatus.BAD_REQUEST, "Failed to blocked Agent from here");
//   }
// };

const blockAgent = async (id) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Fetch the current agent to check the blocked status
    const agent = await Agent.findById(id).session(session);

    if (!agent) {
      throw new AppError(httpStatus.BAD_REQUEST, "Agent not found");
    }

    // Toggle the blocked status
    const updatedBlockedStatus = !agent.blocked;

    const blockedAgent = await Agent.findByIdAndUpdate(
      id,
      { blocked: updatedBlockedStatus }, // Toggle the status
      { new: true, session }
    );

    // If toggling to true, block the user as well
    if (updatedBlockedStatus) {
      const userId = blockedAgent.userId;

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

export const AgentServices = {
  getAgents,
  getSingleAgent,
  updateAgent,
  deleteAgent,
  blockAgent,
};
