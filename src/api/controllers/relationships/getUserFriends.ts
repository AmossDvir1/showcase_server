import Relationship from "../../../models/Relationship";

const getUserFriends = async (userId: string) => {
  const existingRelationship = await Relationship.find({
    $or: [
      {
        user_first_id: userId,
        relState: "friends",
      },
      {
        user_second_id: userId,
        relState: "friends",
      },
    ],
  });
  if (existingRelationship?.length > 0) {
    const friendsIds = existingRelationship.map((rel) => {
      if (rel.user_first_id.toString() !== userId) {
        return rel.user_first_id.toString();
      } else {
        return rel.user_second_id.toString();
      }
    });
    return friendsIds;
  }
  return [];
};

export { getUserFriends };
