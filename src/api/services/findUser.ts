import User from "../../models/User";

const findUserById = async (id: string) => {
  try {
    return User.findOne({ _id: id });
  } catch (err: any) {
    console.error(err.message);
  }
};

const findUserByUsername = async (username: string) => {
    try {
        return User.findOne({ username });
      } catch (err: any) {
        console.error(err.message);
      }
}

export { findUserById, findUserByUsername };
