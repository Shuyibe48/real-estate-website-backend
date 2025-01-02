import express from "express";
import { AdminController } from "./admin.controller.js";

const adminRouter = express.Router();

adminRouter.get("/get-admins", AdminController.getAdmins);
adminRouter.get("/:id", AdminController.getSingleAdmin);
adminRouter.patch("/:id", AdminController.updateAdmin)
adminRouter.delete("/:id", AdminController.deleteAdmin);

export const AdminRoutes = adminRouter;
