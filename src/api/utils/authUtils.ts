import jwt, { JwtPayload } from "jsonwebtoken";
import { CookieOptions } from "express";
import dotenv from "dotenv";
import passport from "passport";
import { Request, Response, NextFunction } from "express";
import Session, { ISession } from "../../models/Session";
import crypto from "crypto";
import { findUserById } from "../services/findUser";
import { IUser } from "../../models/User";
import bcrypt from "bcrypt";
import { io, userSocketMap } from "../..";
import { Socket } from "socket.io";

dotenv.config();

export const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: true,
  signed: true,
  maxAge:
    eval(process.env.REFRESH_TOKEN_EXPIRY ?? (60 * 60 * 24).toString()) * 1000,
  sameSite: "none",
};

export const generateAccessToken = (userId: string): string | null => {
  if (!process.env.JWT_SECRET || !process.env.ACCESS_TOKEN_EXPIRY) {
    return null;
  }
  return jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
    expiresIn: eval(process.env.ACCESS_TOKEN_EXPIRY ?? (60 * 15).toString()),
  });
};

export const generateRefreshToken = (userId: string): ISession | null => {
  if (!process.env.REFRESH_TOKEN_SECRET || !process.env.REFRESH_TOKEN_EXPIRY) {
    return null;
  }
  const refreshToken = jwt.sign(
    { id: userId },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: eval(
        process.env.REFRESH_TOKEN_EXPIRY ?? (60 * 60 * 24).toString()
      ),
    }
  );
  return new Session({
    userId: userId.toString(),
    token: refreshToken,
    // createdAt: new Date(),
    // updatedAt: new Date(),
  });
};

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
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      } catch (err) {
        return res
          .status(401)
          .json({ message: "Invalid token sent", error: "InvalidTokenSent" });
      }
      const userId = (decoded as JwtPayload).id;
      const session = await Session.findOne({ userId });
      if (!session) {
        return res
          .status(401)
          .json({ message: "Session not found", error: "InvalidSession" });
      }
      // Set the decoded token on the request object for further use

      const userDetails = (await findUserById(userId)) as IUser;

      req.user = userDetails;

      // Check if there's no existing mapping for this user
      // if (!userSocketMap.has(userId)) {
      //   // Associate the user's socket with their ID
      //   io.on("connection", (socket: Socket) => {
      //     userSocketMap.set(userId, socket);
      //     console.log(`${userId} connected to Websocket with id ${socket.id}`)
      //     socket.on("disconnect", () => {
      //       console.log(socket.id + " disconnected");
      //     });
      //   });

      //   // Add a listener for socket disconnection to remove the mapping
      //   req.socket.on("disconnect", () => {
      //     userSocketMap.delete(userId);
      //   });
      // }

      // Call next() to proceed to the next middleware or route handler
      return next();
    } catch (err) {
      console.error(err);
      return res.status(401).json({
        message: "You've entered a wrong Username/Password",
        error: "invalidPasswordOrUsername",
      });
    }
  }
  // If the authorization header is missing or the token is invalid, send an error response
  return res
    .status(400)
    .json({ message: "Invalid token sent", error: "InvalidTokenSent" });
};

export const handleUnauthorizedLoginRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "local",
    { session: false },
    (err: Error, user: any, info: any) => {
      if (err) {
        return next(err);
      }

      // Check if user authentication failed
      if (!user) {
        // Customize the response with a custom message and data
        return res.status(401).json({
          message: "Invalid password or username",
          error: "invalidPasswordOrUsername",
        });
      }

      // If authentication succeeded, log in the user
      req.logIn(user, { session: false }, (err) => {
        if (err) {
          return next(err);
        }

        // Call your loginUser function or proceed with further actions
        next();
      });
    }
  )(req, res, next);
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
