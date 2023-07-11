import express from "express";
import { createUser } from "../controllers/users/createUser";
import passport from "passport";
import { loginUser } from "../controllers/users/loginUser";
import { activateUser } from "../controllers/users/activateUser";
import { sendVerificationEmail } from "../controllers/users/sendVerificationEmail";
import {
  checkAuthentication,
  handleUnauthorizedLoginRequest,
} from "../utils/authUtils";
const userRoute = express.Router();
// const passport = require("passport");

// -------------------------- //
// ----- GET Functions ------ //
// -------------------------- //

userRoute.get("/me", checkAuthentication, () => {
  console.log("hi");
});

// -------------------------- //
// ----- POST Functions ----- //
// -------------------------- //

userRoute.post("/create", createUser);
userRoute.post("/login", handleUnauthorizedLoginRequest, loginUser);

userRoute.post("refresh-token");

userRoute.post(
  "/email-verification",
  checkAuthentication,
  sendVerificationEmail
);

// -------------------------- //
// ----- PUT Functions ------ //
// -------------------------- //

userRoute.put("/activate-user", checkAuthentication, activateUser);

// -------------------------- //
// ---- DELETE Functions ---- //
// -------------------------- //

// userRoute.delete("/delete", deleteUser);

export { userRoute };
