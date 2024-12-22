import ChatModel from "../../../models/Chat";

const getPastChatsForUser = async (userId: string) => {
  try {
    const chats = await ChatModel.find({ participants: userId }).exec();
    return chats;
  } catch (err) {
    console.error("Error retrieving chats by userId:", err);
    throw err; 
  }
};

export { getPastChatsForUser };
