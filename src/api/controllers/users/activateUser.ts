import { Request, Response } from "express";
import { IUser } from "../../../models/User";
import bcrypt from "bcrypt";

const activateUser = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const { otp } = req.body;

    if (!otp || !(await bcrypt.compare(otp, user.hashedOtp))) {
      return res
        .status(400)
        .json({ message: "Invalid OTP", error: "InvalidOtp" });
    }

    // Validate the expiration timestamp to ensure the OTP is still valid
    if (user.otpExpiration && user.otpExpiration.getTime() < Date.now()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    user.activated = true;
    user.hashedOtp = "";
    user.otpExpiration = null;
    await user.save();

    // You can now send a success response or proceed with further actions
    return res
      .status(200)
      .json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { activateUser };
