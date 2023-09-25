import { Request, Response } from "express";
import { IUser } from "../../../models/User";

const checkActivation = async (req: Request, res: Response) => {
  const user = req?.user as IUser;
  const activated = user?.activated;
  let message = `"User is ${activated ? "" : "not "}activated "`;
  return res.status(200).json({ message, activated });
};

export { checkActivation };
