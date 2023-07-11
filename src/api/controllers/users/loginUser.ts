import { Request, Response, NextFunction } from "express";
// import User from "../../../models/User";
import { User as UserType } from "../../../models/User";
import { findUserByUsername } from "../../services/findUser";
require("dotenv").config();
import {
  getToken,
  getRefreshToken,
  COOKIE_OPTIONS,
} from "../../utils/authUtils";

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const data = { username: req?.body?.username, password: req?.body?.password };
  console.log(data);
  if (!data || data == undefined) {
    console.error("No data supplied with the login request");
    return res.status(400).json({message: "Please fill all the required fields"});
  }
  const requiredDetailsFulfilled =
    data.hasOwnProperty("username") && data.hasOwnProperty("password");

  //   Check for fulfilling all parameters:
  if (!requiredDetailsFulfilled) {
    return res.status(400).json({message: "Please fill all the required fields"});
  } else {
    try {
      const user = await findUserByUsername(data.username);
      console.log(user);
      if (!user) {
        res.status(401).json({message: "No user found"});
      } else {
        const accessToken = getToken({ _id: user._id });
        const refreshToken = getRefreshToken({ _id: user._id });
        if (!refreshToken){ 
            return res.status(401).json({message: "Error while creating a refreshToken"})
        }
        user.refreshToken.push(refreshToken);
        user.save({ validateBeforeSave: true }).then((savedUser: UserType) => {
            res.setHeader("Access-Control-Allow-Credentials", "true");
            res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
            res.send({ success: true, accessToken });
          
        }).catch((err: any) => {
          return res.status(500).json({message: "Internal Error"});
        });
      }
    } catch (err) {
      next(err);
    }
  }
};

export { loginUser };
