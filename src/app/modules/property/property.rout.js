import express from "express";
import { PropertyController } from "./property.controller.js";

const propertyRouter = express.Router();

propertyRouter.post("/create-property/:id", PropertyController.createProperty);
propertyRouter.get("/get-properties", PropertyController.getProperties);
propertyRouter.get(
  "/promoted-properties",
  PropertyController.getPromotedProperty
);
propertyRouter.get("/:id", PropertyController.getSingleProperty);
propertyRouter.patch("/:id", PropertyController.updateProperty);
propertyRouter.patch(
  "/update-property-promotion-status/:id",
  PropertyController.updatePropertyPromotionStatus
);
propertyRouter.patch(
  "/update-property-promotion-status2/:agencyId",
  PropertyController.updatePropertyPromotionStatus2
);

propertyRouter.patch(
  "/update-property-clicks/:id",
  PropertyController.updatePropertyClicks
);

propertyRouter.patch(
  "/update-property-views/:id",
  PropertyController.updatePropertyViews
);

propertyRouter.patch("/markAsSold/:id", PropertyController.markAsSold);
propertyRouter.delete("/:id", PropertyController.deleteProperty);
propertyRouter.delete("/block/:id", PropertyController.blockProperty);
propertyRouter.delete("/approved/:id", PropertyController.approvedProperty);
propertyRouter.delete("/reject/:id", PropertyController.rejectProperty);

export const PropertyRoutes = propertyRouter;
