import express from "express";
import { AgencyController } from "./agency.controller.js";

const agencyRouter = express.Router();

agencyRouter.post("/create-agency/:id", AgencyController.createAgency);
agencyRouter.get("/get-agencies", AgencyController.getAgencies);
agencyRouter.get("/:id", AgencyController.getSingleAgency);
agencyRouter.patch("/:id", AgencyController.updateAgency);
agencyRouter.post("/add-member/:id", AgencyController.addMember);
agencyRouter.delete("/:id", AgencyController.deleteAgency);

export const AgenciesRoutes = agencyRouter;