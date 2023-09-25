import { Request, Response } from "express";
import { IUser } from "../../../models/User";
import Session from "../../../models/Session";

const logoutUser = async (req: Request, res: Response) => {
  const user = req.user as IUser;
  try {
    const deletedSession = await Session.findOneAndDelete({ userId: user._id });
    return res.json({ message: "user is logged out" });
  } catch (err: any) {
    console.log(err);
  }
};

export { logoutUser };
