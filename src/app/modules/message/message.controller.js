import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { MessageServices } from "./message.service.js";

const createMessage = catchAsync(async (req, res) => {
  const { senderId } = req.body;
  const { toId } = req.body;
  const { messageData } = req.body;

  console.log(senderId);
  console.log(toId);
  console.log(messageData);

  const result = await MessageServices.createMessage(
    senderId,
    toId,
    messageData
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Message has been created successfully",
    data: result,
  });
});

const getUserMessages = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await MessageServices.getUserMessages(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Messages are retrieved successfully",
    data: result,
  });
});

export const MessageController = {
  createMessage,
  getUserMessages,
};
