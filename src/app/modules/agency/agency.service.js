import mongoose from "mongoose";
import { Agency } from "./agency.model.js";
import AppError from "../../errors/AppError.js";
import { User } from "../User/user.model.js";
import httpStatus from "http-status";
import { agencySearchableFields } from "./agency.constant.js";
import QueryBuilder from "../../builder/QueryBuilder.js";
import { generateAgencyId } from "../User/user.utils.js";
import { Agent } from "../agent/agent.model.js";

const createAgency = async (agency, agentId) => {
  const agencyData = { ...agency }; // `agency` প্যারামিটার থেকে ডেটা কপি করা হচ্ছে।
  agencyData.owner = agentId;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    agencyData.id = await generateAgencyId();

    // নতুন এজেন্সি তৈরি করা হচ্ছে
    const newAgency = await Agency.create([agencyData], { session });

    if (!newAgency.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create agency!");
    }

    // এজেন্টের `myAgency` আপডেট করা হচ্ছে
    const myAgency = {
      agency: newAgency[0]._id,
      role: "agencyOwner",
    };

    // তারপর Agent-তে আপডেট
    const agent = await Agent.findByIdAndUpdate(
      agentId,
      {
        $addToSet: { myAgency: myAgency },
      },
      { upsert: true, new: true, session }
    );

    if (!agent) {
      throw new AppError(httpStatus.BAD_REQUEST, "Agent not exist");
    }

    await session.commitTransaction();
    session.endSession();

    return newAgency[0];
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, err.message || err);
  }
};

const getAgencies = async (query) => {
  const agencyQuery = new QueryBuilder(
    Agency.find()
      .populate("properties")
      .populate("member.agent")
      .populate("owner"),
    query
  )
    .search(agencySearchableFields)
    .filter()
    .exactMatch(["address"])
    .sort()
    .paginate()
    .fields();

  const result = await agencyQuery.modelQuery;

  return result;
};

const getSingleAgency = async (id) => {
  const result = await Agency.findById(id).populate("promotedPlan.planId")
    .populate("payments")
    .populate("properties")
    .populate("member.agent")
    .populate("owner");
  return result;
};

const updateAgency = async (id, payload) => {
  // const { name, ...remainingAgencyData } = payload;

  // const modifiedUpdatedData = { ...remainingAgencyData };

  // if (name && Object.keys(name).length) {
  //   for (const [key, value] of Object.entries(name)) {
  //     modifiedUpdatedData[`name.${key}`] = value;
  //   }
  // }

  const result = await Agency.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const addMember = async (id, agent) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // প্রথমে Agency-তে আপডেট
    const agency = await Agency.findByIdAndUpdate(
      id,
      {
        $addToSet: { member: agent },
      },
      { upsert: true, new: true, session }
    );

    const myAgency = {
      agency: id,
      role: agent.role,
    };

    // তারপর Agent-তে আপডেট
    const res = await Agent.findByIdAndUpdate(
      agent.agent,
      {
        $addToSet: { myAgency: myAgency },
      },
      { upsert: true, new: true, session }
    );

    // সবকিছু সফল হলে ট্রানজেকশন কমিট করুন
    await session.commitTransaction();
    session.endSession();

    return agency;
  } catch (error) {
    // কোনো ত্রুটি হলে ট্রানজেকশন রোলব্যাক করুন
    await session.abortTransaction();
    session.endSession();
    throw error; // ত্রুটিটি পুনরায় ছুঁড়ুন যাতে এটি ধরে নেয়া যায়
  }
};

const deleteAgency = async (id) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deletedAgency = await Agency.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session }
    );

    if (!deletedAgency) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to deleted Agency");
    }

    // get user _id from deletedFaculty
    const agencyId = deletedAgency.agencyId;

    const deletedUser = await User.findByIdAndUpdate(
      agencyId,
      { isDeleted: true },
      { new: true, session }
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to deleted user");
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedAgency;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to deleted Agency");
  }
};

export const AgencyServices = {
  createAgency,
  getAgencies,
  getSingleAgency,
  updateAgency,
  addMember,
  deleteAgency,
};
