import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { AppointmentServices } from "./appointment.service.js";

const createAppointment = catchAsync(async (req, res) => {
  const { senderId } = req.body;
  const { toId } = req.body;
  const { appointmentData } = req.body;

  console.log(senderId);
  console.log(toId);
  console.log(appointmentData);

  const result = await AppointmentServices.createAppointment(
    senderId,
    toId,
    appointmentData
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    appointment: "Appointment has been created successfully",
    data: result,
  });
});

const getUserAppointment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AppointmentServices.getUserAppointment(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    appointment: "Appointments are retrieved successfully",
    data: result,
  });
});

const updateAppointmentDate = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { newDate } = req.body;
  const result = await AppointmentServices.updateAppointmentDate(id, newDate);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    appointment: "Appointments is updated successfully",
    data: result,
  });
});

const deleteAppointment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AppointmentServices.deleteAppointment(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    appointment: "Appointments is deleted successfully",
    data: result,
  });
});

export const AppointmentController = {
  createAppointment,
  getUserAppointment,
  updateAppointmentDate,
  deleteAppointment,
};
