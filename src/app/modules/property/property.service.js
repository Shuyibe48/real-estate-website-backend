import { Property } from "./property.model.js";
import QueryBuilder from "../../builder/QueryBuilder.js";
import { propertySearchableFields } from "./property.constant.js";
import { generatePropertyId } from "../User/user.utils.js";
import { User } from "../User/user.model.js";
import mongoose from "mongoose";
import httpStatus from "http-status";
import AppError from "../../errors/AppError.js";
import { Agent } from "../agent/agent.model.js";
import { Agency } from "../agency/agency.model.js";

const createProperty = async (id, agentId, property) => {
  const propertyData = { ...property };

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    propertyData.id = await generatePropertyId();
    propertyData.agencyId = id;
    propertyData.uploaderAgentId = agentId;

    const newProperty = await Property.create([propertyData], { session });

    if (!newProperty.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create property");
    }

    await Agency.findByIdAndUpdate(
      id,
      {
        $addToSet: { properties: [newProperty[0]._id] },
      },
      { upsert: true, new: true, session }
    );

    await Agent.findByIdAndUpdate(
      agentId,
      {
        $addToSet: { properties: [newProperty[0]._id] },
      },
      { upsert: true, new: true, session }
    );

    await session.commitTransaction();
    await session.endSession();
    return newProperty[0];
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, err);
  }
};

// const getProperties = async (query) => {
//   console.log(query);
//   const propertyQuery = new QueryBuilder(Property.find(), query)
//     .search(propertySearchableFields)
//     .filter()
//     .exactMatch(["city", "type", "propertyType", "price"])
//     .sort()
//     .paginate()
//     .fields();

//   const result = await propertyQuery.modelQuery;

//   return result;
// };

// const getProperties = async (query) => {
//   console.log("Incoming Query:", query);

//   const propertyQuery = new QueryBuilder(Property.find(), query)
//     .search(propertySearchableFields)
//     .filter() // propertyType ফিল্টারিং এখানে হচ্ছে
//     .exactMatch(["city", "type"]) // শুধুমাত্র অন্য ফিল্ডগুলোর জন্য exactMatch
//     .sort()
//     .paginate()
//     .fields();

//   const result = await propertyQuery.modelQuery;

//   return result;
// };

// const getProperties = async (query) => {
//   const propertyQuery = new QueryBuilder(
//     Property.find().populate("agencyId").populate("uploaderAgentId"),
//     query
//   )
//     .search(propertySearchableFields) // Partial match for searchable fields
//     .filter()
//     .exactMatch(["city", "type"]) // `type` এর জন্য exact match এবং `city` এর জন্য partial match
//     .sort()
//     .paginate()
//     .fields();

//   const result = await propertyQuery.modelQuery;

//   return result;
// };
const getProperties = async (query) => {
  try {
    const propertyQuery = new QueryBuilder(
      Property.find()
        .populate("agencyId") // শুধু প্রয়োজনীয় ফিল্ডগুলো populate
        .populate("uploaderAgentId"), // শুধু প্রয়োজনীয় ফিল্ড
      query
    )
      .search(propertySearchableFields) // Partial match for searchable fields
      .filter()
      .exactMatch(["city", "type"]) // `type` এর জন্য exact match এবং `city` এর জন্য partial match
      .sort() // if not specified, default sorting can be applied like createdAt
      .paginate()
      .fields();

    const result = await propertyQuery.modelQuery;

    if (!result.length) {
      throw new AppError(httpStatus.NOT_FOUND, "No properties found.");
    }

    return result;
  } catch (error) {
    // Handle any unexpected errors
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error retrieving properties."
    );
  }
};

// const getSingleProperty = async (id) => {
//   const result = await Property.findById(id)
//     .populate("reviews")
//     .populate("agencyId")
//     .populate("uploaderAgentId");
//   return result;
// };
const getSingleProperty = async (id) => {
  try {
    const result = await Property.findById(id)
      .populate("reviews") // শুধু প্রয়োজনীয় ফিল্ড populate
      .populate("agencyId") // শুধু প্রয়োজনীয় ফিল্ড populate
      .populate("uploaderAgentId");

    if (!result) {
      throw new AppError(httpStatus.NOT_FOUND, "Property not found.");
    }

    return result;
  } catch (error) {
    // Handle any unexpected errors
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error retrieving property."
    );
  }
};

const getPromotedProperty = async () => {
  try {
    const result = await Property.find({ isPromoted: true });
    return result;
  } catch (error) {
    console.error("Error fetching promoted properties:", error);
    throw new Error("Error fetching promoted properties.");
  }
};

// const updateProperty = async (id, payload) => {
//   const result = await Property.findByIdAndUpdate(id, payload, {
//     new: true,
//     runValidators: true,
//   });
//   return result;
// };
const updateProperty = async (id, payload) => {
  try {
    // Property ডাটা খুঁজে বের করা
    const existingProperty = await Property.findById(id);

    if (!existingProperty) {
      throw new AppError(httpStatus.NOT_FOUND, "Property not found.");
    }

    // প্রপার্টি আপডেট করা
    const updatedProperty = await Property.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    return updatedProperty;
  } catch (error) {
    // Unexpected errors handle করা
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error updating property."
    );
  }
};

const updatePropertyPromotionStatus = async (id, isPromotedStatus) => {
  try {
    const result = await Property.findByIdAndUpdate(
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
      `Error updating property promotion status: ${error.message}`
    );
  }
};

const updatePropertyPromotionStatus2 = async (agencyId) => {
  try {
    const result = await Property.updateMany(
      { agencyId: agencyId }, // Match properties by agencyId
      { isPromoted: false, clicks: 0 }, // Set isPromoted to false
      {
        new: true,
        runValidators: true,
      }
    );
    return result;
  } catch (error) {
    throw new Error(
      `Error updating property promotion status for agencyId ${agencyId}: ${error.message}`
    );
  }
};

const updatePropertyClicks = async (id) => {
  try {
    const result = await Property.findByIdAndUpdate(
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
      `Error updating property promotion status: ${error.message}`
    );
  }
};

const updatePropertyViews = async (id) => {
  try {
    const result = await Property.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      {
        new: true,
        runValidators: true,
      }
    );
    return result;
  } catch (error) {
    throw new Error(
      `Error updating property promotion status: ${error.message}`
    );
  }
};

// const deleteProperty = async (id, propertyId) => {
//   const session = await mongoose.startSession();

//   try {
//     session.startTransaction();

//     const deletedProperty = await Property.findByIdAndUpdate(
//       propertyId,
//       { isDeleted: true },
//       { new: true, session }
//     );

//     if (!deletedProperty) {
//       throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete property");
//     }

//     const deletedPropertyFromUser = await User.findByIdAndUpdate(
//       id,
//       {
//         $pull: { properties: deletedProperty._id },
//       },
//       { new: true, session }
//     );

//     if (!deletedPropertyFromUser) {
//       throw new AppError(
//         httpStatus.BAD_REQUEST,
//         "Failed to delete property from user"
//       );
//     }

//     await session.commitTransaction();
//     await session.endSession();

//     return deletedProperty;
//   } catch (err) {
//     await session.abortTransaction();
//     await session.endSession();
//     throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete property");
//   }
// };

const deleteProperty = async (propertyId) => {
  try {
    const deletedProperty = await Property.findByIdAndUpdate(
      propertyId,
      { isDeleted: true },
      { new: true }
    );

    if (!deletedProperty) {
      throw new AppError(httpStatus.NOT_FOUND, "Property not found");
    }

    return deletedProperty;
  } catch (err) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "An error occurred while deleting the property"
    );
  }
};

const markAsSold = async (propertyId) => {
  try {
    const markAsSold = await Property.findByIdAndUpdate(
      propertyId,
      { type: "Sold" },
      { new: true }
    );

    if (!markAsSold) {
      throw new AppError(httpStatus.NOT_FOUND, "Property not found");
    }

    return markAsSold;
  } catch (err) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "An error occurred while type as sold updating the property"
    );
  }
};

const blockProperty = async (id) => {
  try {
    const property = await Property.findById(id);

    if (!property) {
      throw new AppError(httpStatus.BAD_REQUEST, "Property not found");
    }

    // Toggle the blocked status
    const updatedBlockedStatus = !property.blocked;

    const blockedProperty = await Property.findByIdAndUpdate(
      id,
      { blocked: updatedBlockedStatus },
      { new: true }
    );

    return blockedProperty;
  } catch (err) {
    throw new AppError(httpStatus.BAD_REQUEST, "Blocked property failed");
  }
};

const approvedProperty = async (id) => {
  try {
    const property = await Property.findById(id);

    if (!property) {
      throw new AppError(httpStatus.BAD_REQUEST, "Property not found");
    }

    // Toggle the approved status
    const updatedApprovedStatus = !property.approved;

    const approvedProperty = await Property.findByIdAndUpdate(
      id,
      { approved: updatedApprovedStatus },
      { new: true }
    );

    return approvedProperty;
  } catch (err) {
    throw new AppError(httpStatus.BAD_REQUEST, "Approved property failed");
  }
};

const rejectProperty = async (id) => {
  try {
    const property = await Property.findById(id);

    if (!property) {
      throw new AppError(httpStatus.BAD_REQUEST, "Property not found");
    }

    // Toggle the reject status
    const updatedRejectStatus = !property.reject;

    const rejectProperty = await Property.findByIdAndUpdate(
      id,
      { reject: updatedRejectStatus },
      { new: true }
    );

    return rejectProperty;
  } catch (err) {
    throw new AppError(httpStatus.BAD_REQUEST, "Reject property failed");
  }
};

export const PropertyServices = {
  createProperty,
  getProperties,
  getSingleProperty,
  getPromotedProperty,
  updateProperty,
  updatePropertyPromotionStatus,
  updatePropertyPromotionStatus2,
  updatePropertyClicks,
  updatePropertyViews,
  deleteProperty,
  markAsSold,
  blockProperty,
  approvedProperty,
  rejectProperty,
};
