import express from "express";
import { ReviewsController } from "./reviews.controller.js";

const reviewsRouter = express.Router();

reviewsRouter.get("/get-reviews", ReviewsController.getReviews);
reviewsRouter.patch("/:id", ReviewsController.updateReview);
reviewsRouter.post("/create-reviews-agent/:id", ReviewsController.createReviewsAgent);
reviewsRouter.post("/create-reviews-property/:id", ReviewsController.createReviewsProperty);
reviewsRouter.delete("/:id", ReviewsController.deleteReview);
reviewsRouter.delete("/approved/:id", ReviewsController.approvedReview);
reviewsRouter.delete("/reject/:id", ReviewsController.rejectReview);

export const ReviewsRoutes = reviewsRouter;
