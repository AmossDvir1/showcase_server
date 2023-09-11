import { Request, Response } from "express";
import { IUser } from "../../../models/User";

const getUserInfo = async (req: Request, res: Response) => {
  const user = req?.user as IUser;
  console.log(user.username);

  return res
    .status(200)
    .json({
      userData: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
      },
    });
};

export { getUserInfo };
