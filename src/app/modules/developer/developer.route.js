import express from "express";
import { DeveloperController } from "./developer.controller.js";

const developerRouter = express.Router();

developerRouter.get("/get-developers", DeveloperController.getDevelopers);
developerRouter.get("/:id", DeveloperController.getSingleDeveloper);
developerRouter.patch("/:id", DeveloperController.updateDeveloper);
developerRouter.delete("/:id", DeveloperController.deleteDeveloper);
developerRouter.delete("/block/:id", DeveloperController.blockDeveloper);

export const DevelopersRoutes = developerRouter;