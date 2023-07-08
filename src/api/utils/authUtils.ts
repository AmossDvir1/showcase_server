import jwt, { JwtPayload } from "jsonwebtoken";
import { CookieOptions } from "express";
import dotenv from "dotenv";
import passport from "passport";
import { Request, Response, NextFunction } from "express";
import { Session } from "../../models/Session";
import crypto from "crypto";
import { findUserById } from "../services/findUser";
import {User} from "../../models/User";
import bcrypt from "bcrypt";

dotenv.config();

export const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: true,
  signed: true,
  maxAge:
    eval(process.env.REFRESH_TOKEN_EXPIRY ?? (60 * 60 * 24).toString()) * 1000,
  sameSite: "none",
};

export function getToken(user: any): string | null {
  if (!process.env.JWT_SECRET || !process.env.ACCESS_TOKEN_EXPIRY) {
    return null;
  }
  return jwt.sign(user, process.env.JWT_SECRET as string, {
    expiresIn: eval(process.env.ACCESS_TOKEN_EXPIRY ?? (60 * 15).toString()),
  });
}

export function getRefreshToken(user: any): Session | null {
  if (!process.env.REFRESH_TOKEN_SECRET || !process.env.REFRESH_TOKEN_EXPIRY) {
    return null;
  }
  const refreshToken = jwt.sign(
    user,
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: eval(
        process.env.REFRESH_TOKEN_EXPIRY ?? (60 * 60 * 24).toString()
      ),
    }
  );
  return { token: refreshToken, createdAt: Date.now() };
}

dotenv.config();

export const checkAuthentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Retrieve the authorization header
  const authHeader = req.headers.authorization;

  // Check if the authorization header is present
  if (authHeader) {
    // Split the authorization header to get the token
    const token = authHeader.split(" ")[1];

    try {
      // Verify and decode the JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      // Set the decoded token on the request object for further use
      const userId = (decoded as JwtPayload)._id;

      const userDetails = await findUserById(userId) as User;
      req.user = userDetails;
      // Call next() to proceed to the next middleware or route handler
      return next();
    } catch (err) {
      console.error(err);
    }
  }

  // If the authorization header is missing or the token is invalid, send an error response
  return res.status(401).json({ message: "Unauthorized" });
};

export const generateHashedOtp = async (length: number) => {
  const digits = "0123456789";
  let otp = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, digits.length);
    otp += digits[randomIndex];
  }

  const saltRounds = 10;
  const hashedOtp = await bcrypt.hash(otp, saltRounds);

  return { otp, hashedOtp };
};

module.exports.verifyUser = passport.authenticate("jwt", { session: false });
