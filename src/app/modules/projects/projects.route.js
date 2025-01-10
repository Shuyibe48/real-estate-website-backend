import express from "express";
import { ProjectController } from "./projects.controller.js";

const projectRouter = express.Router();

projectRouter.post("/create-project/:id", ProjectController.createProject);
projectRouter.get("/get-projects", ProjectController.getProjects);
projectRouter.get(
  "/promoted-projects",
  ProjectController.getPromotedProject
);
projectRouter.get("/:id", ProjectController.getSingleProject);
projectRouter.patch("/:id", ProjectController.updateProject);
projectRouter.patch(
  "/update-project-promotion-status/:id",
  ProjectController.updateProjectPromotionStatus
);
projectRouter.patch(
  "/update-project-promotion-status2/:agencyId",
  ProjectController.updateProjectPromotionStatus2
);
projectRouter.patch(
  "/update-project-clicks/:id",
  ProjectController.updateProjectClicks
);
projectRouter.patch("/markAsSold/:id", ProjectController.markAsSold);
projectRouter.delete("/:id", ProjectController.deleteProject);
projectRouter.delete("/block/:id", ProjectController.blockProject);
projectRouter.delete("/approved/:id", ProjectController.approvedProject);
projectRouter.delete("/reject/:id", ProjectController.rejectProject);


export const ProjectsRoutes = projectRouter;
