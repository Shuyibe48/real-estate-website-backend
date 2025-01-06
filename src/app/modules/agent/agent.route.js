import express from "express";
import { AgentController } from "./agent.controller.js";

const agentRouter = express.Router();

agentRouter.get("/get-agents", AgentController.getAgents);
agentRouter.get("/:id", AgentController.getSingleAgent);
agentRouter.patch("/:id", AgentController.updateAgent);
agentRouter.delete("/:id", AgentController.deleteAgent);
agentRouter.delete("/block/:id", AgentController.blockAgent);

export const AgentsRoutes = agentRouter;
