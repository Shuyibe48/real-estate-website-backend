import express from "express";
import { BlogController } from "./blog.controller.js";

const blogRouter = express.Router();

blogRouter.post("/create-blog", BlogController.createBlog);
blogRouter.get("/get-blogs", BlogController.getBlog);
blogRouter.get("/:id", BlogController.getSingleBlog);
blogRouter.patch("/:id", BlogController.updateBlog);
blogRouter.delete("/:id", BlogController.deleteBlog);

export const BlogsRoutes = blogRouter;