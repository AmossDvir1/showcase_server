import { Socket } from "socket.io";
import Message from "../../../models/Message"; // Import Message model
import Chat from "../../../models/Chat"; // Import Chat model
import { areUsersFriends } from "../../controllers/relationships/utils";
import { broadcastToSession, broadcastToUser } from "./broadcast";
import { getAllSocketsByUserId } from "./socketConnections";

const typingUsers: { [key: string]: NodeJS.Timeout | null } = {}; // Store typing timeouts by userId

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
    let chat = await Chat.findOne({
      participants: { $all: [senderId, friendId] },
    });

    // If chat doesn't exist, create one
    if (!chat) {
      chat = new Chat({
        participants: [senderId, friendId],
        lastMessage: { content: null, createdAt: new Date() },
      });
      await chat.save();
    }
    // Use the newly created chat's ID
    const chatId = chat._id; // Update chatId to the new chat's ID

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
    await newMessage.populate("senderId", "username profilePicture");
    const dataToBroadcast = { newMessage };
    // Broadcast to user's all other active devices:
    const otherUserSockets = getAllSocketsByUserId(senderId)?.filter(
      (soc) => soc?.sessionId !== socket.sessionId
    );
    if (otherUserSockets && otherUserSockets.length > 0) {
      otherUserSockets.forEach((soc) => {
        if (soc?.sessionId) {
          broadcastToSession(
            dataToBroadcast,
            senderId,
            soc?.sessionId,
            "newMessage"
          );
        }
      });
    }
    broadcastToUser(dataToBroadcast, friendId, "newMessage");

    console.log(`Message sent to chat ${chatId} by user ${senderId}`);
  } catch (error) {
    console.error("Error in sendMessage handler:", error);
    socket.emit("error", {
      message: "Something went wrong. Please try again.",
    });
  }
};

const typing = async (socket: Socket, data: { friendId: string; isTyping: boolean }) => {
  try {
    const senderId = socket.user?.id;

    // Validate if senderId exists
    if (!senderId) {
      return socket.emit("error", { message: "Sender not authenticated!" });
    }

    const { friendId, isTyping } = data;

    // Broadcast typing status to the recipient (friend)
    const dataToBroadcast = { friendId: senderId, isTyping };

    // Emit the "typing" event to the recipient's sockets
    broadcastToUser(dataToBroadcast, friendId, "typing");

    console.log(`User ${senderId} is typing to user ${friendId}: ${isTyping}`);
  } catch (error) {
    console.error("Error in typing event handler:", error);
    socket.emit("error", {
      message: "Something went wrong while notifying typing status.",
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
    let chat = await Chat.findOne({
      participants: { $all: [senderId, friendId] },
    });

    if (!chat) {
      // If chat doesn't exist, create one
      chat = new Chat({
        participants: [senderId, friendId],
        lastMessage: { content: null, createdAt: new Date() },
      });
      await chat.save();

      const chatId = chat._id; // Update chatId to the new chat's ID
      socket.emit("conversation", { messages: [], chatId });
    }

    // Fetch the messages for the chat with pagination
    const messages = await Message.find({ chatId: chat._id })
      .sort({ createdAt: -1 }) // Sort by most recent messages first
      .skip(skip) // Skip messages for pagination
      .limit(limit) // Limit number of messages
      .populate("senderId", "username profilePicture") // Populate sender's info for each message
      .exec();

    // Emit the conversation (messages) to the client
    socket.emit("conversation", { messages, chatId: chat._id });
  } catch (error) {
    console.error("Error in handleGetConversation handler:", error);
    socket.emit("error", {
      message: "Something went wrong. Please try again.",
    });
  }
};

export { sendMessage, getConversation, typing };
