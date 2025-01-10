import express from "express";
import { PlatformsController } from "./platform.controller.js";

const platformsRouter = express.Router();

platformsRouter.get("/get-platforms", PlatformsController.getPlatforms);
platformsRouter.patch("/:id", PlatformsController.updatePlatform);

export const PlatformsRoutes = platformsRouter;