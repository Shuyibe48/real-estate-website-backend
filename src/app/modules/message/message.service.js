import mongoose from "mongoose";
import { Chat, Message } from "./message.model.js";
import { User } from "../User/user.model.js";
import AppError from "../../errors/AppError.js";
import httpStatus from "http-status";

const createMessage = async (senderId, toId, messageData) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Find existing chat between the participants
    let chat = await Chat.findOne({
      participants: { $all: [senderId, toId] },
    }).session(session);

    // Create a new message
    const newMessage = await Message.create([{ text: messageData, senderId }], {
      session,
    });

    if (!newMessage.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create message");
    }

    const messageId = newMessage[0]._id;

    if (!chat) {
      // If no chat exists, create a new chat
      chat = await Chat.create(
        [
          {
            participants: [senderId, toId],
            messages: [messageId],
          },
        ],
        { session }
      );

      if (!chat.length) {
        throw new AppError(httpStatus.BAD_REQUEST, "Failed to create chat");
      }

      chat = chat[0];

      // Update users with the new chat
      await User.updateMany(
        { _id: { $in: [senderId, toId] } },
        { $push: { chats: chat._id } },
        { session }
      );
    } else {
      // If chat exists, add the message to the chat
      chat.messages.push(messageId);
      await chat.save({ session });
    }

    await session.commitTransaction();
    await session.endSession();

    return { message: newMessage[0], chat };
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, err.message);
  }
};

// const getUserMessages = async (id) => {
//   try {
//     const chats = await Chat.find({ participants: id })
//       .populate("messages")
//       .populate("participants");
//     return chats;
//   } catch (error) {
//     throw new Error("Failed to fetch user messages: " + error.message);
//   }
// };

const getUserMessages = async (id) => {
  try {
    const chats = await Chat.find({ participants: id })
      .populate("messages")
      .populate("participants")
      .sort({ updatedAt: -1 }); // Sort by updatedAt in descending order
    return chats;
  } catch (error) {
    throw new Error("Failed to fetch user messages: " + error.message);
  }
};

export const MessageServices = {
  createMessage,
  getUserMessages,
};
