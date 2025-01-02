import express from "express";
import { PlanController } from "./plan.controller.js";

const planRouter = express.Router();

planRouter.post("/create-plan", PlanController.createPlan);
planRouter.get("/get-plans", PlanController.getPlan);
planRouter.patch("/:id", PlanController.updatePlan);
planRouter.delete("/:id", PlanController.deletePlan);

export const PlanRoutes = planRouter;