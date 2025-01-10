import express from "express";
import { ComplainsController } from "./complains.controller.js";

const complainsRouter = express.Router();

complainsRouter.get("/get-complains", ComplainsController.getComplains);
complainsRouter.post("/create-complains/:id", ComplainsController.createComplains);
complainsRouter.delete("/:id", ComplainsController.deleteComplain);
complainsRouter.delete("/approved/:id", ComplainsController.approvedComplain);

export const ComplainsRoutes = complainsRouter;