import mongoose from "mongoose";
import User from "../../models/User";

export const saveUserOtp = async (
  userId: string,
  hashedOtp: string,
  expiration: Date
) => {
  // Find the user by their ID and update the OTP and expiration fields
  return await User.findByIdAndUpdate(userId, {
    hashedOtp,
    otpExpiration: expiration,
  });
};
