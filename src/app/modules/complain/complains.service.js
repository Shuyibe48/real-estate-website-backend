import mongoose from "mongoose";
import httpStatus from "http-status";
import AppError from "../../errors/AppError.js";
import { Agent } from "../agent/agent.model.js";
import { Property } from "../property/property.model.js";
import { complainSearchableFields } from "./complains.constant.js";
import QueryBuilder from "../../builder/QueryBuilder.js";
import { Complains } from "./complains.model.js";

const getComplains = async (query) => {
  const complainsQuery = new QueryBuilder(
    Complains.find().populate("userId"),
    query
  )
    .search(complainSearchableFields) // Partial match for searchable fields
    .filter()
    .exactMatch(["city", "type"]) // `type` এর জন্য exact match এবং `city` এর জন্য partial match
    .sort()
    .paginate()
    .fields();

  const result = await complainsQuery.modelQuery;

  return result;
};

const createComplains = async (id, complains) => {
  const result = await Complains.create(complains);
  return result;
};

const deleteComplain = async (id) => {
  try {
    const deletedComplain = await Complains.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!deletedComplain) {
      throw new AppError(httpStatus.NOT_FOUND, "Complain not found");
    }

    return deletedComplain;
  } catch (err) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "An error occurred while deleting the Complain"
    );
  }
};

const approvedComplain = async (id) => {
  try {
    const complain = await Complains.findById(id);

    if (!complain) {
      throw new AppError(httpStatus.BAD_REQUEST, "Complain not found");
    }

    // Toggle the approved status
    const updatedApprovedStatus = !complain.approved;

    const approvedComplain = await Complains.findByIdAndUpdate(
      id,
      { approved: updatedApprovedStatus },
      { new: true }
    );

    return approvedComplain;
  } catch (err) {
    throw new AppError(httpStatus.BAD_REQUEST, "Approved complain failed");
  }
};

export const ComplainsServices = {
  getComplains,
  createComplains,
  deleteComplain,
  approvedComplain,
};
