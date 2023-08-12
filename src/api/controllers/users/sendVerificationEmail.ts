import { Request, Response, NextFunction } from "express";
require("dotenv").config();
import nodemailer from "nodemailer";
import {
  emailSubject,
  generateVerificationEmailBody,
} from "../../../utils/constants";
import { IUser } from "../../../models/User";
import { generateHashedOtp } from "../../utils/authUtils";
import { saveUserOtp } from "../../services/saveUserOtp";

const sendVerificationEmail = async (req: Request, res: Response) => {
  const user = req.user as IUser;
  if (!user || !user.email) {
    console.log(user)
    console.error("User not exists");
    return res
      .status(401)
      .json({ message: "Unauthorized", error: "unauthorizedUserError" });
  }
  const { otp, hashedOtp } = await generateHashedOtp(6);
  var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: { rejectUnauthorized: false },
  });
  const emailOptions = {
    from: "showcase",
    to: user.email,
    subject: emailSubject,
    html: generateVerificationEmailBody(user.username, otp),
  };

  try {
    await transporter.sendMail(emailOptions);
    console.log("Email sent successfully");
    await saveUserOtp(
      user._id,
      hashedOtp,
      new Date(Date.now() + 15 * 60 * 1000)
    ); // 15 minutes from now
    return res.sendStatus(200);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "err" });
  }
};

export { sendVerificationEmail };
