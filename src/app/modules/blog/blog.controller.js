import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { BlogServices } from "./blog.service.js";

const createBlog = catchAsync(async (req, res) => {
  const { blog } = req.body;

  const result = await BlogServices.createBlog(blog);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog has been created successfully",
    data: result,
  });
});

const getBlog = catchAsync(async (req, res) => {
  const result = await BlogServices.getBlog();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog is retrieved successfully",
    data: result,
  });
});

const getSingleBlog = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BlogServices.getSingleBlog(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog is retrieved successfully",
    data: result,
  });
});

const updateBlog = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { updatedData } = req.body;
  const result = await BlogServices.updateBlog(id, updatedData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog is updated successfully",
    data: result,
  });
});

const deleteBlog = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BlogServices.deleteBlog(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog is deleted successfully",
    data: result,
  });
});

export const BlogController = {
  createBlog,
  getBlog,
  getSingleBlog,
  updateBlog,
  deleteBlog,
};
