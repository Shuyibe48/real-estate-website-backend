import { Blog } from "./blog.model.js";
import AppError from "../../errors/AppError.js";
import httpStatus from "http-status";

const createBlog = async (blog) => {
  try {
    // Create a new blog
    const newBlog = await Blog.create(blog);

    // Check if the blog was created successfully
    if (!newBlog) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create blog");
    }

    return newBlog;
  } catch (err) {
    throw new AppError(httpStatus.BAD_REQUEST, err.message);
  }
};

const getBlog = async () => {
  try {
    const blog = await Blog.find();
    return blog;
  } catch (error) {
    throw new Error("Failed to fetch blog: " + error.message);
  }
};

const getSingleBlog = async (id) => {
  try {
    const blog = await Blog.findById(id);
    return blog;
  } catch (error) {
    throw new Error("Failed to fetch blog: " + error.message);
  }
};

const updateBlog = async (_id, updatedData) => {
  try {
    // Update the blog
    const blog = await Blog.findByIdAndUpdate(
      _id, // ObjectId from the frontend
      updatedData, // Updated blog data
      { new: true, runValidators: true } // Return the updated document and validate
    );

    if (!blog) {
      throw new Error("Blog not found with the provided ID");
    }

    return blog;
  } catch (error) {
    throw new Error("Failed to update blog: " + error.message);
  }
};

const deleteBlog = async (id) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!blog) {
      throw new Error("Blog not found with the given ID");
    }

    return blog;
  } catch (error) {
    throw new Error("Failed to delete blog");
  }
};

export const BlogServices = {
  createBlog,
  getBlog,
  getSingleBlog,
  updateBlog,
  deleteBlog,
};
