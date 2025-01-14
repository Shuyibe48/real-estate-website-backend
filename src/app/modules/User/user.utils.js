import { Agency } from "../agency/agency.model.js";
import { Project } from "../projects/projects.model.js";
import { Property } from "../property/property.model.js";
import USER_ROLE from "./user.constant.js";
import { User } from "./user.model.js";

// const findLastBuyerId = async () => {
//   const lastBuyer = await User.findOne(
//     {
//       role: USER_ROLE.buyer,
//     },
//     { id: 1, _id: 0 }
//   )
//     .sort({ createdAt: -1 })
//     .lean();

//   return lastBuyer?.id ? lastBuyer.id.substring(2) : undefined;
// };
const findLastBuyerId = async () => {
  try {
    const lastBuyer = await User.findOne(
      {
        role: USER_ROLE.buyer,
      },
      { id: 1, _id: 0 }
    )
      .sort({ createdAt: -1 })
      .lean();

    // যদি lastBuyer পাওয়া না যায়, তবে undefined ফেরত দেবে
    if (!lastBuyer || !lastBuyer.id) {
      return undefined;
    }

    // id এর প্রথম দুটি অক্ষর বাদ দিয়ে বাকি অংশটি ফেরত দেওয়া
    return lastBuyer.id.substring(2);
  } catch (error) {
    // কোনো ত্রুটি ঘটলে তা হ্যান্ডেল করা
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Error fetching last buyer id.");
  }
};


// export const generateBuyerId = async () => {
//   let currentId = (0).toString();
//   const lastBuyerId = await findLastBuyerId();

//   if (lastBuyerId) {
//     currentId = lastBuyerId.substring(3);
//   }

//   let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");

//   incrementId = `BU-${incrementId}`;

//   return incrementId;
// };
export const generateBuyerId = async () => {
  let currentId = (0).toString();
  const lastBuyerId = await findLastBuyerId();

  if (lastBuyerId) {
    // প্রথম দুটি অক্ষর বাদ দিয়ে সংখ্যাটির অংশটি নেওয়া
    currentId = lastBuyerId.substring(2);
  }

  // বর্তমান id এর পরবর্তী সংখ্যা তৈরি করা
  let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");

  // নতুন id তৈরি করা
  incrementId = `BU-${incrementId}`;

  return incrementId;
};


// Agent ID
// export const findLastAgentId = async () => {
//   const lastAgent = await User.findOne(
//     {
//       role: USER_ROLE.agent,
//     },
//     {
//       id: 1,
//       _id: 0,
//     }
//   )
//     .sort({
//       createdAt: -1,
//     })
//     .lean();

//   return lastAgent?.id ? lastAgent.id.substring(2) : undefined;
// };
export const findLastAgentId = async () => {
  const lastAgent = await User.findOne(
    {
      role: USER_ROLE.agent,
    },
    {
      id: 1,
      _id: 0,
    }
  )
    .sort({ createdAt: -1 })
    .lean();

  // যদি lastAgent বিদ্যমান থাকে এবং id পাওয়া যায় তবে তার substring(2) ব্যবহার করা
  return lastAgent?.id?.substring(2);
};


// export const generateAgentId = async () => {
//   let currentId = (0).toString();
//   const lastAgentId = await findLastAgentId();

//   if (lastAgentId) {
//     currentId = lastAgentId.substring(3);
//   }

//   let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");

//   incrementId = `AG-${incrementId}`;

//   return incrementId;
// };
export const generateAgentId = async () => {
  let currentId = '0000'; // Default currentId set to '0000' for safe start
  const lastAgentId = await findLastAgentId();

  if (lastAgentId) {
    currentId = lastAgentId; // No need to substring as findLastAgentId gives the correct part already
  }

  // Increment and ensure 4-digit format
  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  return `AG-${incrementId}`;
};


// Admin ID
// export const findLastAdminId = async () => {
//   const lastAdmin = await User.findOne(
//     {
//       role: USER_ROLE.admin,
//     },
//     {
//       id: 1,
//       _id: 0,
//     }
//   )
//     .sort({
//       createdAt: -1,
//     })
//     .lean();

//   return lastAdmin?.id ? lastAdmin.id.substring(2) : undefined;
// };
export const findLastAdminId = async () => {
  const lastAdmin = await User.findOne(
    {
      role: USER_ROLE.admin,
    },
    {
      id: 1,
      _id: 0,
    }
  )
    .sort({ createdAt: -1 })
    .lean();

  // Check if lastAdmin exists and return the id part after 'AD-' prefix
  return lastAdmin?.id ? lastAdmin.id.slice(3) : undefined;
};


// export const generateAdminId = async () => {
//   let currentId = (0).toString();
//   const lastAdminId = await findLastAdminId();

//   if (lastAdminId) {
//     currentId = lastAdminId.substring(3);
//   }

//   let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");

//   incrementId = `AD-${incrementId}`;
//   return incrementId;
// };
export const generateAdminId = async () => {
  let currentId = (0).toString();
  const lastAdminId = await findLastAdminId();

  if (lastAdminId) {
    currentId = lastAdminId.slice(3);  // Use slice instead of substring
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");

  incrementId = `AD-${incrementId}`;
  return incrementId;
};


// Developer ID
// export const findLastDeveloperId = async () => {
//   const lastDeveloper = await User.findOne(
//     {
//       role: USER_ROLE.developer,
//     },
//     {
//       id: 1,
//       _id: 0,
//     }
//   )
//     .sort({
//       createdAt: -1,
//     })
//     .lean();

//   return lastDeveloper?.id ? lastDeveloper.id.substring(2) : undefined;
// };
export const findLastDeveloperId = async () => {
  const lastDeveloper = await User.findOne(
    {
      role: USER_ROLE.developer,
    },
    {
      id: 1,
      _id: 0,
    }
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastDeveloper?.id ? lastDeveloper.id.slice(2) : undefined; // Use slice instead of substring
};


// export const generateDeveloperId = async () => {
//   let currentId = (0).toString();
//   const lastDeveloperId = await findLastDeveloperId();

//   if (lastDeveloperId) {
//     currentId = lastDeveloperId.substring(3);
//   }

//   let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");

//   incrementId = `DV-${incrementId}`;
//   return incrementId;
// };
export const generateDeveloperId = async () => {
  let currentId = (0).toString();
  const lastDeveloperId = await findLastDeveloperId();

  if (lastDeveloperId) {
    currentId = lastDeveloperId.slice(3); // Use slice instead of substring
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");

  incrementId = `DV-${incrementId}`;
  return incrementId;
};


// property id
// const findLastPropertyId = async () => {
//   const lastProperty = await Property.findOne().sort({ createdAt: -1 }).lean();

//   return lastProperty?.id ? lastProperty.id.substring(2) : undefined;
// };
const findLastPropertyId = async () => {
  const lastProperty = await Property.findOne().sort({ createdAt: -1 }).lean();

  return lastProperty?.id ? lastProperty.id.slice(2) : undefined;  // Use slice instead of substring
};


// export const generatePropertyId = async () => {
//   let currentId = (0).toString();
//   const lastPropertyId = await findLastPropertyId();

//   if (lastPropertyId) {
//     currentId = lastPropertyId.substring(3);
//   }

//   let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");

//   incrementId = `PR-${incrementId}`;
//   return incrementId;
// };
export const generatePropertyId = async () => {
  let currentId = (0).toString();
  const lastPropertyId = await findLastPropertyId();

  if (lastPropertyId) {
    currentId = lastPropertyId.slice(3);  // Use slice instead of substring
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");

  incrementId = `PR-${incrementId}`;
  return incrementId;
};


// property id
// const findLastProjectId = async () => {
//   const lastProject = await Project.findOne().sort({ createdAt: -1 }).lean();

//   return lastProject?.id ? lastProject.id.substring(2) : undefined;
// };
const findLastProjectId = async () => {
  const lastProject = await Project.findOne().sort({ createdAt: -1 }).lean();

  return lastProject?.id ? lastProject.id.slice(2) : undefined;
};


// export const generateProjectId = async () => {
//   let currentId = (0).toString();
//   const lastProjectId = await findLastProjectId();

//   if (lastProjectId) {
//     currentId = lastProjectId.substring(3);
//   }

//   let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");

//   incrementId = `PJ-${incrementId}`;
//   return incrementId;
// };
export const generateProjectId = async () => {
  let currentId = (0).toString();
  const lastProjectId = await findLastProjectId();

  if (lastProjectId) {
    currentId = lastProjectId.slice(3);  // পরিবর্তন করা হয়েছে
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");

  incrementId = `PJ-${incrementId}`;
  return incrementId;
};



// agency id
// const findLastAgencyId = async () => {
//   const lastAgency = await Agency.findOne().sort({ createdAt: -1 }).lean();

//   return lastAgency?.id ? lastAgency.id.substring(2) : undefined;
// };
const findLastAgencyId = async () => {
  const lastAgency = await Agency.findOne().sort({ createdAt: -1 }).lean();

  return lastAgency?.id ? lastAgency.id.slice(2) : undefined;  // পরিবর্তন করা হয়েছে
};


// export const generateAgencyId = async () => {
//   let currentId = (0).toString();
//   const lastAgencyId = await findLastAgencyId();

//   if (lastAgencyId) {
//     currentId = lastAgencyId.substring(3);
//   }

//   let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");

//   incrementId = `AC-${incrementId}`;
//   return incrementId;
// };
export const generateAgencyId = async () => {
  let currentId = (0).toString();
  const lastAgencyId = await findLastAgencyId();

  if (lastAgencyId) {
    currentId = lastAgencyId.slice(3);  // পরিবর্তন করা হয়েছে
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");

  incrementId = `AC-${incrementId}`;
  return incrementId;
};

