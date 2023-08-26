import { Request, Response } from "express";
import User from "../../../models/User";
import { IUser } from "../../../models/User";
import {
  generateAccessToken,
  generateRefreshToken,
  COOKIE_OPTIONS,
} from "../../utils/authUtils";
import { allDetailsProvided } from "../../utils/helpers";
import { findUserByEmail, findUserByUsername } from "../../services/findUser";
import Session from "../../../models/Session";
import { createUserSession } from "../../utils/createUserSession";

const createUser = async (req: Request, res: Response) => {
  const data = req?.body;
  if (!data) {
    return res.status(400).json({ message: "" });
  }
  //   Check for fulfilling all parameters:
  if (!allDetailsProvided(data)) {
    return res
      .status(400)
      .json({ message: "Please fill all the required fields" });
  } else {
    await registerUser(data, res);
  }
};

const registerUser = async (userData: any, res: Response) => {
  // Check if user is already exists:
  if (await findUserByUsername(userData.username)) {
    return res.status(400).json({
      message: "Username is already taken. Please choose a different username.",
      error: "userNameAlreadyExists",
    });
  }
  if (await findUserByEmail(userData.email)) {
    return res.status(400).json({
      message: "Email is already taken. Please try again.",
      error: "emailAlreadyExists",
    });
  }

  console.log(`Registering ${userData.username} ...`);

  const existingUsersCount = await User.countDocuments({
    firstName: userData.firstName,
    lastName: userData.lastName,
  });

  const lowercaseFirstName = userData.firstName
    .replace(/[^a-zA-Z]/g, "")
    .toLowerCase();
  const lowercaseLastName = userData.lastName
    .replace(/[^a-zA-Z]/g, "")
    .toLowerCase();

  const urlMapping = `${lowercaseFirstName}.${lowercaseLastName}${
    existingUsersCount && "." + existingUsersCount
  }`;

  User.updateMany();
  const user = new User({
    email: userData.email,
    username: userData.username,
    firstName: userData.firstName,
    lastName: userData.lastName,
    urlMapping,
  });
  try {
    const registeredUser = await User.register(user, userData.password);

    const accessToken = generateAccessToken(registeredUser._id);
    const refreshToken = generateRefreshToken(registeredUser._id);
    if (refreshToken === null || accessToken === null) {
      return res
        .status(500)
        .json({ message: "Secret/public key is missing", error: "" });
    }
    const newSessionData = refreshToken.toObject();
    let savedUser = await registeredUser.save();
    console.log(
      "User created successfully! \n info: " + JSON.stringify(userData)
    );
    createUserSession(user, refreshToken);

    savedUser = savedUser.toObject();
    res.cookie("refreshToken", newSessionData.token, COOKIE_OPTIONS);
    return res.status(201).json({ success: true, accessToken });
  } catch (err: any) {
    console.log(err);
    return res.status(401).json({
      message: "Email is already taken. Please try again",
      error: "emailAlreadyExists",
    });
  }
};

export { createUser };
