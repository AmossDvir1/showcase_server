import { Socket } from "socket.io";
import Message from "../../../models/Message"; // Import Message model
import Chat from "../../../models/Chat"; // Import Chat model
import { getSocketIdByUserId } from "./socketConnections"; // Helper to get socket ID
import { areUsersFriends } from "../../controllers/relationships/utils";

const sendMessage = async (
  socket: Socket,
  data: { friendId: string; content: string }
) => {
  try {
    let { friendId, content } = data;
    const senderId = socket.user?.id;

    // Validate if senderId exists
    if (!senderId) {
      return socket.emit("error", { message: "Sender not authenticated!" });
    }

    // Check if the sender and recipient are friends
    const isFriends = await areUsersFriends(senderId, friendId);
    if (!isFriends) {
      return socket.emit("error", {
        message:
          "You are not friends with this user and cannot send a message.",
      });
    }
    let ids = [senderId, friendId].sort();
    let chat = await Chat.findOne({
        participants: { $all: ids },
    });

    // If chat doesn't exist, create one
    if (!chat) {
      chat = await Chat.create({
        participants: ids, // Create a new chat with the sender and recipient
        lastMessage: { content, createdAt: new Date() }, // Set the first message as the last message
      });
    }
    // Use the newly created chat's ID
    const chatId = chat._id.toString(); // Update chatId to the new chat's ID

    // Save the message in the database
    const newMessage = await Message.create({
      chatId,
      senderId,
      content,
      createdAt: new Date(),
      readBy: [], // Initialize as an empty array; will update later when users read the message
    });

    // Update the lastMessage in the Chat model
    await Chat.updateOne(
      { _id: chatId },
      {
        $set: { lastMessage: { content, createdAt: newMessage.createdAt } },
      }
    );

    // Emit the message to the recipient (friend)
    const friendSocketId = getSocketIdByUserId(friendId);
    if (friendSocketId) {
      socket.to(friendSocketId).emit("newMessage", { newMessage });
    }

    // // Optionally, emit the message to the sender as well (e.g., for the sender's chat history)
    // socket.emit("newMessage", { newMessage });

    console.log(`Message sent to chat ${chatId} by user ${senderId}`);
  } catch (error) {
    console.error("Error in sendMessage handler:", error);
    socket.emit("error", {
      message: "Something went wrong. Please try again.",
    });
  }
};

const getConversation = async (
  socket: Socket,
  data: { friendId: string; limit?: number; skip?: number }
) => {
  try {
    const { friendId, limit = 20, skip = 0 } = data; // Limit messages to 20 by default, and skip for pagination
    const senderId = socket.user?.id;

    // Validate if senderId exists
    if (!senderId) {
      return socket.emit("error", { message: "Sender not authenticated!" });
    }

    // Check if the users are friends before proceeding
    const isFriends = await areUsersFriends(senderId, friendId);
    if (!isFriends) {
      return socket.emit("error", {
        message:
          "You are not friends with this user and cannot access the conversation.",
      });
    }

    // Find the chat between the two users
    const chat = await Chat.findOne({
      participants: { $all: [senderId, friendId] },
    });

    if (!chat) {
      return socket.emit("error", {
        message: "No conversation found between you and your friend!",
      });
    }

    // Fetch the messages for the chat with pagination
    const messages = await Message.find({ chatId: chat._id })
      .sort({ createdAt: 1 }) // Sort by most recent messages first
      .skip(skip) // Skip messages for pagination
      .limit(limit) // Limit number of messages
      .populate("senderId", "username profilePicture") // Populate sender's info for each message
      .exec();

    // Emit the conversation (messages) to the client
    socket.emit("conversation", { messages });
  } catch (error) {
    console.error("Error in handleGetConversation handler:", error);
    socket.emit("error", {
      message: "Something went wrong. Please try again.",
    });
  }
};

export { sendMessage, getConversation };
