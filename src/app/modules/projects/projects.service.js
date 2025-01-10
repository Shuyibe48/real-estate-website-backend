import { Project } from "./projects.model.js";
import QueryBuilder from "../../builder/QueryBuilder.js";
import { projectSearchableFields } from "./projects.constant.js";
import { generateProjectId } from "../User/user.utils.js";
import mongoose from "mongoose";
import httpStatus from "http-status";
import AppError from "../../errors/AppError.js";
import { Developer } from "../developer/developer.model.js";

const createProject = async (id, project) => {
  const projectData = { ...project };

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    projectData.id = await generateProjectId();
    projectData.developerId = id;

    const newProject = await Project.create([projectData], { session });

    if (!newProject.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create project");
    }

    await Developer.findByIdAndUpdate(
      id,
      {
        $addToSet: { projects: [newProject[0]._id] },
      },
      { upsert: true, new: true, session }
    );

    await session.commitTransaction();
    await session.endSession();
    return newProject[0];
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, err);
  }
};

// const getProjects = async (query) => {
//   console.log(query);
//   const projectQuery = new QueryBuilder(Property.find(), query)
//     .search(propertySearchableFields)
//     .filter()
//     .exactMatch(["city", "type", "propertyType", "price"])
//     .sort()
//     .paginate()
//     .fields();

//   const result = await projectQuery.modelQuery;

//   return result;
// };

// const getProjects = async (query) => {
//   console.log("Incoming Query:", query);

//   const projectQuery = new QueryBuilder(Property.find(), query)
//     .search(propertySearchableFields)
//     .filter() // propertyType ফিল্টারিং এখানে হচ্ছে
//     .exactMatch(["city", "type"]) // শুধুমাত্র অন্য ফিল্ডগুলোর জন্য exactMatch
//     .sort()
//     .paginate()
//     .fields();

//   const result = await projectQuery.modelQuery;

//   return result;
// };

const getProjects = async (query) => {
  const projectQuery = new QueryBuilder(
    Project.find().populate("developerId"),
    query
  )
    .search(projectSearchableFields) // Partial match for searchable fields
    .filter()
    .exactMatch(["city", "type"]) // `type` এর জন্য exact match এবং `city` এর জন্য partial match
    .sort()
    .paginate()
    .fields();

  const result = await projectQuery.modelQuery;

  return result;
};

const getSingleProject = async (id) => {
  const result = await Project.findById(id)
    .populate("developerId")
  return result;
};

const getPromotedProject = async () => {
  try {
    const result = await Project.find({ isPromoted: true });
    return result;
  } catch (error) {
    console.error("Error fetching promoted properties:", error);
    throw new Error("Error fetching promoted properties.");
  }
};

const updateProject = async (id, payload) => {
  const result = await Project.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const updateProjectPromotionStatus = async (id, isPromotedStatus) => {
  try {
    const result = await Project.findByIdAndUpdate(
      id,
      { isPromoted: isPromotedStatus },
      {
        new: true,
        runValidators: true,
      }
    );
    return result;
  } catch (error) {
    throw new Error(
      `Error updating project promotion status: ${error.message}`
    );
  }
};

const updateProjectPromotionStatus2 = async (developerId) => {
  try {
    const result = await Project.updateMany(
      { developerId: developerId }, // Match properties by developerId
      { isPromoted: false, clicks: 0 }, // Set isPromoted to false
      {
        new: true,
        runValidators: true,
      }
    );
    return result;
  } catch (error) {
    throw new Error(
      `Error updating project promotion status for developerId ${developerId}: ${error.message}`
    );
  }
};

const updateProjectClicks = async (id) => {
  try {
    const result = await Project.findByIdAndUpdate(
      id,
      { $inc: { clicks: 1 } },
      {
        new: true,
        runValidators: true,
      }
    );
    return result;
  } catch (error) {
    throw new Error(
      `Error updating project promotion status: ${error.message}`
    );
  }
};

// const deleteProject = async (id, projectId) => {
//   const session = await mongoose.startSession();

//   try {
//     session.startTransaction();

//     const deletedProject = await Property.findByIdAndUpdate(
//       projectId,
//       { isDeleted: true },
//       { new: true, session }
//     );

//     if (!deletedProject) {
//       throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete project");
//     }

//     const deletedPropertyFromUser = await User.findByIdAndUpdate(
//       id,
//       {
//         $pull: { properties: deletedProject._id },
//       },
//       { new: true, session }
//     );

//     if (!deletedPropertyFromUser) {
//       throw new AppError(
//         httpStatus.BAD_REQUEST,
//         "Failed to delete project from user"
//       );
//     }

//     await session.commitTransaction();
//     await session.endSession();

//     return deletedProject;
//   } catch (err) {
//     await session.abortTransaction();
//     await session.endSession();
//     throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete project");
//   }
// };

const deleteProject = async (projectId) => {
  try {
    const deletedProject = await Project.findByIdAndUpdate(
      projectId,
      { isDeleted: true },
      { new: true }
    );

    if (!deletedProject) {
      throw new AppError(httpStatus.NOT_FOUND, "Project not found");
    }

    return deletedProject;
  } catch (err) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "An error occurred while deleting the project");
  }
};

const markAsSold = async (projectId) => {
  try {
    const markAsSold = await Project.findByIdAndUpdate(
      projectId,
      { type: "Sold" },
      { new: true }
    );

    if (!markAsSold) {
      throw new AppError(httpStatus.NOT_FOUND, "Project not found");
    }

    return markAsSold;
  } catch (err) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "An error occurred while type as sold updating the project");
  }
};


export const ProjectServices = {
  createProject,
  getProjects,
  getSingleProject,
  getPromotedProject,
  updateProject,
  updateProjectPromotionStatus,
  updateProjectPromotionStatus2,
  updateProjectClicks,
  deleteProject,
  markAsSold
};
