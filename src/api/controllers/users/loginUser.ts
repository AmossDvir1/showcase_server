import { Request, Response, NextFunction } from "express";
import { IUser } from "../../../models/User";
import { findUserByUsername } from "../../services/findUser";
require("dotenv").config();
import {
  generateAccessToken,
  generateRefreshToken,
  COOKIE_OPTIONS,
} from "../../utils/authUtils";
import Session from "../../../models/Session";

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const data = { username: req?.body?.username, password: req?.body?.password };
  console.log(data);
  if (!data || data == undefined) {
    console.error("No data supplied with the login request");
    return res
      .status(400)
      .json({ message: "Please fill all the required fields" });
  }
  const requiredDetailsFulfilled =
    data.hasOwnProperty("username") && data.hasOwnProperty("password");

  //   Check for fulfilling all parameters:
  if (!requiredDetailsFulfilled) {
    return res
      .status(400)
      .json({ message: "Please fill all the required fields" });
  } else {
    try {
      const user = await findUserByUsername(data.username);
      console.log(user);
      if (!user) {
        res.status(401).json({ message: "No user found" });
      } else {
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        if (!refreshToken) {
          return res
            .status(401)
            .json({ message: "Error while creating a refreshToken" });
        }
        // Convert the Mongoose document to a plain JavaScript object
        const newSessionData = refreshToken.toObject();
        // Remove the _id field from the newSessionData object
        delete newSessionData._id;
        newSessionData.userId = user._id;
        // await refreshToken.save();

        const session = await Session.find({ userId: user._id });
        if (session){
          await Session.findOneAndUpdate({ userId: user._id },  {token: refreshToken.token}, { upsert: true });
        }
        else{
          const newSession = await refreshToken.save();
        }
        await user
          .save({ validateBeforeSave: true })
          .then((savedUser: IUser) => {
            res.setHeader("Access-Control-Allow-Credentials", "true");
            res.cookie("refreshToken", newSessionData.token, COOKIE_OPTIONS);
            res.json({ success: true, accessToken });
          })
          .catch((err: any) => {
            return res.status(500).json({ message: "Internal Error" });
          });
      }
    } catch (err) {
      next(err);
    }
  }
};

export { loginUser };
