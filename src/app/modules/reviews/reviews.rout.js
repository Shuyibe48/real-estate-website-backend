import express from "express";
import { ReviewsController } from "./reviews.controller.js";

const reviewsRouter = express.Router();

reviewsRouter.post("/create-reviews-agent/:id", ReviewsController.createReviewsAgent);
reviewsRouter.post("/create-reviews-agency/:id", ReviewsController.createReviewsAgency);

// reviewsRouter.patch("/:id", ReviewsController.updateReviews);
// reviewsRouter.delete("/:id", ReviewsController.deleteReviews);

export const ReviewsRoutes = reviewsRouter;
