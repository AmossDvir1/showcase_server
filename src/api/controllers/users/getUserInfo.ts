import { Request, Response } from "express";
import { IUser } from "../../../models/User";

const getUserInfo = async (req: Request, res: Response) => {
  const user = req?.user as IUser;
  if (user) {
    const populatedUser = await user.populate({
      path: "profilePicture",
      model: "Picture",
    });
    return res.status(200).json({ userData: populatedUser });
  } else {
    return res.status(403).json({ message: "No user info" });
  }
};

export { getUserInfo };
