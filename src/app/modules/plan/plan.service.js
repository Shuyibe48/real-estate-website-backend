import { Plan } from "./plan.model.js"; // Plan মডেল ইনপোর্ট করা হলো
import AppError from "../../errors/AppError.js";
import httpStatus from "http-status";

const createPlan = async (plan) => {
  try {
    // Create a new plan
    const newPlan = await Plan.create(plan);

    // Check if the plan was created successfully
    if (!newPlan) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create plan");
    }

    return newPlan;
  } catch (err) {
    throw new AppError(httpStatus.BAD_REQUEST, err.message);
  }
};

const getPlan = async () => {
  try {
    const plan = await Plan.find();
    return plan;
  } catch (error) {
    throw new Error("Failed to fetch plan: " + error.message);
  }
};

const updatePlan = async (_id, updatedData) => {
  try {
    // Validate the ObjectId
    if (!_id || !/^[0-9a-fA-F]{24}$/.test(_id)) {
      throw new Error("Invalid ObjectId provided");
    }
    
    // Update the plan
    const plan = await Plan.findByIdAndUpdate(
      _id, // ObjectId from the frontend
      updatedData, // Updated plan data
      { new: true, runValidators: true } // Return the updated document and validate
    );

    if (!plan) {
      throw new Error("Plan not found with the provided ID");
    }

    return plan;
  } catch (error) {
    throw new Error("Failed to update plan: " + error.message);
  }
};

const deletePlan = async (id) => {
  try {
    const plan = await Plan.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!plan) {
      throw new Error("Plan not found with the given ID");
    }

    return plan;
  } catch (error) {
    throw new Error("Failed to delete plan");
  }
};

export const PlanServices = {
  createPlan,
  getPlan,
  updatePlan,
  deletePlan,
};
