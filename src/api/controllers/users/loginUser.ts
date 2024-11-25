import { Request, Response, NextFunction } from "express";
import { findUserByUsername } from "../../services/findUser";
import dotenv from "dotenv";
import {
  generateAccessToken,
  generateRefreshToken,
  COOKIE_OPTIONS,
  createSession,
} from "../../utils/authUtils";
import Session from "../../../models/Session";

dotenv.config();


const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const data = { username: req?.body?.username, password: req?.body?.password };

  if (!data || data == undefined) {
    console.error("No data supplied with the login request");
    return res
      .status(400)
      .json({ message: "Please fill all the required fields" });
  }
  const requiredDetailsFulfilled =
    data.hasOwnProperty("username") && data.hasOwnProperty("password");

  // Check for fulfilling all parameters
  if (!requiredDetailsFulfilled) {
    return res
      .status(400)
      .json({ message: "Please fill all the required fields" });
  } else {
    try {
      const user = await findUserByUsername(data.username);
      if (!user) {
        return res.status(401).json({ message: "No user found" });
      }

      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);
      if (!refreshToken) {
        return res
          .status(401)
          .json({ message: "Error while creating a refreshToken" });
      }

      // Save a new session
      const newSession = createSession(user._id, refreshToken.token, req);
      await newSession.save();

      // Send response with tokens
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.cookie("refreshToken", refreshToken.token, COOKIE_OPTIONS);
      res.json({ success: true, accessToken, sessionId: newSession._id });
    } catch (err) {
      next(err);
    }
  }
};

export { loginUser };
