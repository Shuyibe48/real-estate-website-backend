import { Agency } from "../agency/agency.model.js";
import { Project } from "../projects/projects.model.js";
import { Property } from "../property/property.model.js";
import USER_ROLE from "./user.constant.js";
import { User } from "./user.model.js";

const findLastBuyerId = async () => {
  const lastBuyer = await User.findOne(
    {
      role: USER_ROLE.buyer,
    },
    { id: 1, _id: 0 }
  )
    .sort({ createdAt: -1 })
    .lean();

  return lastBuyer?.id ? lastBuyer.id.substring(2) : undefined;
};

export const generateBuyerId = async () => {
  let currentId = (0).toString();
  const lastBuyerId = await findLastBuyerId();

  if (lastBuyerId) {
    currentId = lastBuyerId.substring(3);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");

  incrementId = `BU-${incrementId}`;

  return incrementId;
};

// Agent ID
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
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastAgent?.id ? lastAgent.id.substring(2) : undefined;
};

export const generateAgentId = async () => {
  let currentId = (0).toString();
  const lastAgentId = await findLastAgentId();

  if (lastAgentId) {
    currentId = lastAgentId.substring(3);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");

  incrementId = `AG-${incrementId}`;

  return incrementId;
};

// Admin ID
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
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastAdmin?.id ? lastAdmin.id.substring(2) : undefined;
};

export const generateAdminId = async () => {
  let currentId = (0).toString();
  const lastAdminId = await findLastAdminId();

  if (lastAdminId) {
    currentId = lastAdminId.substring(3);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");

  incrementId = `AD-${incrementId}`;
  return incrementId;
};

// Developer ID
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

  return lastDeveloper?.id ? lastDeveloper.id.substring(2) : undefined;
};

export const generateDeveloperId = async () => {
  let currentId = (0).toString();
  const lastDeveloperId = await findLastDeveloperId();

  if (lastDeveloperId) {
    currentId = lastDeveloperId.substring(3);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");

  incrementId = `DV-${incrementId}`;
  return incrementId;
};

// property id
const findLastPropertyId = async () => {
  const lastProperty = await Property.findOne().sort({ createdAt: -1 }).lean();

  return lastProperty?.id ? lastProperty.id.substring(2) : undefined;
};

export const generatePropertyId = async () => {
  let currentId = (0).toString();
  const lastPropertyId = await findLastPropertyId();

  if (lastPropertyId) {
    currentId = lastPropertyId.substring(3);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");

  incrementId = `PR-${incrementId}`;
  return incrementId;
};

// property id
const findLastProjectId = async () => {
  const lastProject = await Project.findOne().sort({ createdAt: -1 }).lean();

  return lastProject?.id ? lastProject.id.substring(2) : undefined;
};

export const generateProjectId = async () => {
  let currentId = (0).toString();
  const lastProjectId = await findLastProjectId();

  if (lastProjectId) {
    currentId = lastProjectId.substring(3);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");

  incrementId = `PJ-${incrementId}`;
  return incrementId;
};


// agency id
const findLastAgencyId = async () => {
  const lastAgency = await Agency.findOne().sort({ createdAt: -1 }).lean();

  return lastAgency?.id ? lastAgency.id.substring(2) : undefined;
};

export const generateAgencyId = async () => {
  let currentId = (0).toString();
  const lastAgencyId = await findLastAgencyId();

  if (lastAgencyId) {
    currentId = lastAgencyId.substring(3);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");

  incrementId = `AC-${incrementId}`;
  return incrementId;
};
