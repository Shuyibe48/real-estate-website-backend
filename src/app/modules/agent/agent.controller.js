import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { AgentServices } from "./agent.service.js";

const getAgents = catchAsync(async (req, res) => {
  const result = await AgentServices.getAgents(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Agent is retrieved successfully",
    data: result,
  });
});

const getSingleAgent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AgentServices.getSingleAgent(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Agent is retrieved successfully",
    data: result,
  });
});

const updateAgent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { Agent } = req.body;
  const result = await AgentServices.updateAgent(id, Agent);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Agent is updated successfully",
    data: result,
  });
});

const deleteAgent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AgentServices.deleteAgent(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Agent is deleted successfully",
    data: result,
  });
});

const blockAgent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AgentServices.blockAgent(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Agent is blocked successfully",
    data: result,
  });
});

export const AgentController = {
  getAgents,
  getSingleAgent,
  updateAgent,
  deleteAgent,
  blockAgent,
};
