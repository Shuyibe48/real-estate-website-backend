import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { AgencyServices } from "./agency.service.js";

const createAgency = catchAsync(async (req, res) => {
  const agentId = req.params.id;
  const agency = req.body;

  const result = await AgencyServices.createAgency(agency, agentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Agency has been created successfully",
    data: result,
  });
});

const getAgencies = catchAsync(async (req, res) => {
  const result = await AgencyServices.getAgencies(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Agency is retrieved successfully",
    data: result,
  });
});

const getSingleAgency = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AgencyServices.getSingleAgency(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Agency is retrieved successfully",
    data: result,
  });
});

const updateAgency = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { agency } = req.body;
  const result = await AgencyServices.updateAgency(id, agency);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Agency is updated successfully",
    data: result,
  });
});

const addMember = catchAsync(async (req, res) => {
  const { id } = req.params;
  const agent = req.body;

  const result = await AgencyServices.addMember(id, agent);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Agent has been added successfully as a member",
    data: result,
  });
});

const deleteAgency = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AgencyServices.deleteAgency(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Agency is deleted successfully",
    data: result,
  });
});

export const AgencyController = {
  createAgency,
  getAgencies,
  getSingleAgency,
  updateAgency,
  addMember, 
  deleteAgency,
};
