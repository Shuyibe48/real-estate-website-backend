import express from "express";
import { AppointmentController } from "./appointment.controller.js";

const appointmentRouter = express.Router();

appointmentRouter.post("/create-appointment", AppointmentController.createAppointment);
appointmentRouter.get("/:id", AppointmentController.getUserAppointment);
appointmentRouter.patch("/:id", AppointmentController.updateAppointmentDate);
appointmentRouter.delete("/:id", AppointmentController.deleteAppointment);

export const AppointmentRoutes = appointmentRouter;