import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { ProjectServices } from "./projects.service.js";

const createProject = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { project } = req.body;

  const result = await ProjectServices.createProject(id, project);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Project has been created successfully",
    data: result,
  });
});

const getProjects = catchAsync(async (req, res) => {
  const result = await ProjectServices.getProjects(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Projects are retrieved successfully",
    data: result,
  });
});

const getSingleProject = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ProjectServices.getSingleProject(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Project is retrieved successfully",
    data: result,
  });
});

const getPromotedProject = catchAsync(async (req, res) => {
  const result = await ProjectServices.getPromotedProject();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Promoted projects are retrieved successfully",
    data: result,
  });
});

const updateProject = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { project } = req.body;
  const result = await ProjectServices.updateProject(id, project);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Project is updated successfully",
    data: result,
  });
});

const updateProjectPromotionStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { isPromoted } = req.body;

  const result = await ProjectServices.updateProjectPromotionStatus(
    id,
    isPromoted
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Project promotion status is updated successfully",
    data: result,
  });
});

const updateProjectPromotionStatus2 = catchAsync(async (req, res) => {
  const { developerId } = req.params;

  const result = await ProjectServices.updateProjectPromotionStatus2(
    developerId
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Project promotion status is updated successfully",
    data: result,
  });
});

const updateProjectClicks = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await ProjectServices.updateProjectClicks(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Project click is updated successfully",
    data: result,
  });
});

const deleteProject = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await ProjectServices.deleteProject(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Project is deleted successfully",
    data: result,
  });
});

const markAsSold = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await ProjectServices.markAsSold(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Project type marked as sold successfully",
    data: result,
  });
});


const blockProject = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ProjectServices.blockProject(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blocked project successfully",
    data: result,
  });
});

const approvedProject = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ProjectServices.approvedProject(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Approved project successfully",
    data: result,
  });
});

const rejectProject = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ProjectServices.rejectProject(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reject project successfully",
    data: result,
  });
});

export const ProjectController = {
  createProject,
  getProjects,
  getSingleProject,
  getPromotedProject,
  updateProject,
  updateProjectPromotionStatus,
  updateProjectPromotionStatus2,
  updateProjectClicks,
  deleteProject,
  markAsSold,
  blockProject,
  approvedProject,
  rejectProject,
};