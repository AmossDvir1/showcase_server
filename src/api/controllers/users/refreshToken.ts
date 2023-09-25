import jwt, { JwtPayload } from "jsonwebtoken";
import {
  COOKIE_OPTIONS,
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/authUtils";
import { Request, Response } from "express";
import Session from "../../../models/Session";
require("dotenv").config();

export const refreshToken = async (req: Request, res: Response) => {
  // Take the refreshToken out of the cookie:
  const cookies = req.signedCookies;
  const refreshToken = cookies?.refreshToken?.toString();

  if (!refreshToken) {
    return res
      .status(401)
      .json({ message: "No refresh token found.", error: "noRefreshToken" });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as jwt.Secret
    );
    const userId = (decoded as JwtPayload).id;
    // Check if the refresh token exists in the database
    const session = await Session.findOne({ userId, token: refreshToken });
    if (!session) {
      return res.status(401).json({ message: "Invalid refresh token." });
    }
    // await Session.findOneAndUpdate();
    // If the refresh token is valid, generate a new refresh token and access token
    const newAccessToken = generateAccessToken(userId);
    // If the refresh token exists, then create new one and replace it.
    const newRefreshToken = generateRefreshToken(userId);
    if (!newRefreshToken || !newRefreshToken) {
      return res.status(401).json({ message: "Refresh token expired." });
    }
    // Update the old refresh token in the database with the new one
    session.token = newRefreshToken.token;
    session.updatedAt = new Date();
    // await session.save();
    const result = await Session.findOneAndUpdate(
      { userId },
      {
        token: newRefreshToken.token,
        updatedAt: new Date(),
      },
      { upsert: true }
    );

    // Set the new refresh token and access token in the response cookies
    res.cookie("refreshToken", newRefreshToken.token, COOKIE_OPTIONS);
    res.setHeader("Access-Control-Allow-Credentials", "true");

    return res.status(200).json({ success: true, accessToken: newAccessToken });
  } catch (err: any) {
    console.log(err);
    res.status(401).json({ message: "", error: "" });
  }
};
