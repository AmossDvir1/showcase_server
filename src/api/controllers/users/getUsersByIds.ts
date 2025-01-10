import User from "../../../models/User";

const getUsersByIds = async (userIds: string[]) => {
  try {
    const users = await User.find({ _id: { $in: userIds } });
    return users;
  } catch (err) {
    console.error("Error fetching users:", err);
    throw err;
  }
};

export default getUsersByIds;