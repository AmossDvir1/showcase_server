import { Chat } from "../../../models/Chat";

/**
 * Finds the other participant's ID in a chat given a user's ID.
 * @param chat - The Chat instance.
 * @param userId - The ID of the user requesting the other participant.
 * @returns The other participant's ID or null if not found.
 */
const getOtherParticipantId = (chat: Chat, userId: string): string => {
  if (!chat || !chat.participants || !userId) {
    throw new Error("Invalid input: chat and userId must be provided.");
  }

  // Filter out the user's ID from the participants array
  const otherParticipants = chat.participants.filter(
    (participant) => participant !== userId
  );

  // Return the other participant ID or null if none found
  return otherParticipants.length > 0 ? otherParticipants[0] : "";
};

export { getOtherParticipantId }