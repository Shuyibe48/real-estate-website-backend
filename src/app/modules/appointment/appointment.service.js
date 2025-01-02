import mongoose from "mongoose";
import { User } from "../User/user.model.js";
import AppError from "../../errors/AppError.js";
import httpStatus from "http-status";
import { Appointment } from "./appointment.model.js";

const createAppointment = async (senderId, toId, appointmentData) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Create a new message
    const newAppointment = await Appointment.create([appointmentData], {
      session,
    });

    if (!newAppointment.length) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Failed to create appointment"
      );
    }

    const appointmentId = newAppointment[0]._id;

    // Update users with the new chat
    await User.updateMany(
      { _id: { $in: [senderId, toId] } },
      { $push: { appointments: appointmentId } },
      { session }
    );

    await session.commitTransaction();
    await session.endSession();

    return { appointment: newAppointment[0] };
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, err.message);
  }
};

const getUserAppointment = async (id) => {
  try {
    const appointment = await Appointment.find({ _id: id });
    return appointment;
  } catch (error) {
    throw new Error("Failed to fetch user messages: " + error.message);
  }
};

const updateAppointmentDate = async (_id, newDate) => {
  try {
    // Validate the ObjectId
    if (!_id || !/^[0-9a-fA-F]{24}$/.test(_id)) {
      throw new Error("Invalid ObjectId provided");
    }

    // Validate the new date
    if (!newDate || isNaN(new Date(newDate).getTime())) {
      throw new Error("Invalid date provided");
    }

    // Update the appointment
    const appointment = await Appointment.findByIdAndUpdate(
      _id, // ObjectId from the frontend
      { date: new Date(newDate) }, // Update the date field
      { new: true, runValidators: true } // Return the updated document and validate
    );

    if (!appointment) {
      throw new Error("Appointment not found with the provided ID");
    }

    return appointment;
  } catch (error) {
    throw new Error("Failed to update appointment date: " + error.message);
  }
};

const deleteAppointment = async (id) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      id, // ফ্রন্টেন্ড থেকে পাঠানো _id
      { isDeleted: true }, // isDeleted ফিল্ডকে true করা
      { new: true } // আপডেটেড ডাটা রিটার্ন করার জন্য
    );

    if (!appointment) {
      throw new Error("Appointment not found with the given ID");
    }

    return appointment;
  } catch (error) {
    throw new Error("Failed to delete the appointment");
  }
};

export const AppointmentServices = {
  createAppointment,
  getUserAppointment,
  updateAppointmentDate,
  deleteAppointment,
};
