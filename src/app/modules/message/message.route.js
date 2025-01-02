import express from "express";
import { MessageController } from "./message.controller.js";

const messageRouter = express.Router();

messageRouter.post("/create-message", MessageController.createMessage);
messageRouter.get("/:id", MessageController.getUserMessages);

export const MessageRoutes = messageRouter;