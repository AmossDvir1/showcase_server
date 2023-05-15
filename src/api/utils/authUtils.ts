import jwt from "jsonwebtoken";
import { CookieOptions } from "express";
import dotenv from "dotenv";
import { Session } from "../../models/Session";
import passport from "passport"

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
    if (!process.env.JWT_SECRET || !process.env.ACCESS_TOKEN_EXPIRY){
        return null;
    }
  return jwt.sign(user, process.env.JWT_SECRET as string, {
    expiresIn: eval(process.env.ACCESS_TOKEN_EXPIRY ?? (60 * 15).toString()),
  });
}

export function getRefreshToken(user: any): Session | null {
    if (!process.env.REFRESH_TOKEN_SECRET || !process.env.REFRESH_TOKEN_EXPIRY){
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

module.exports.verifyUser = passport.authenticate("jwt", { session: false });
