import { Request, Response } from "express";
import User from "../../../models/User";
import { User as UserType } from "../../../models/User";
import {
  getToken,
  getRefreshToken,
  COOKIE_OPTIONS,
} from "../../utils/authUtils";
import { allDetailsProvided } from "../../utils/helpers";
import { findUserByUsername } from "../../services/findUser";

const createUser = async (req: Request, res: Response) => {
  const data = req?.body;
  if (!data) {
    return res.status(400).json({message: ""});
  }
  //   Check for fulfilling all parameters:
  if (!allDetailsProvided(data)) {
    return res.status(400).json({message: "Please fill all the required fields"});
  } else {
    await registerUser(data, res);
  }
};

const registerUser = async (userData: any, res: Response) => {
  if (await findUserByUsername(userData.username)) {
    return res.status(400).json({message: "Username is already taken. Please choose a different username.", error:"userNameAlreadyExists"});
  }
  console.log(userData.username);

  User.register(
    new User({
      email: userData.email,
      username: userData.username,
      // password: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
    }),
    userData.password,
    (err: Error, user: UserType) => {
      if (err) {
        console.log(err);

        return res.status(401).json({message:"Email is already taken. Please try again", error: "emailAlreadyExists"});
      } else {
        const accessToken = getToken({ _id: user._id });
        const refreshToken = getRefreshToken({ _id: user._id });
        if (refreshToken === null || accessToken === null) {
          return res.status(500).json({message: "Secret/public key is missing", error: ""});
        }
        user.refreshToken.push(refreshToken);
        user
          .save({ validateBeforeSave: true })
          .then((savedUser: UserType) => {
            console.log(
              "User created successfully! \n info: " + JSON.stringify(userData)
            );
            savedUser = savedUser.toObject();
            try {
              res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
            } catch (err: any) {
              console.error(err.message);
              return res.status(500).json(err.message);
            }
            return res.status(201).json({ success: true, accessToken });
          })
          .catch((err: any) => {
            console.error(err);
            return res.status(500).json({message: "Internal Error"})
          });
      }
    }
  );
};

export { createUser };
