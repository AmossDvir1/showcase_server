import express from "express";
import { createUser } from "../controllers/users/createUser";
import { loginUser } from "../controllers/users/loginUser";
import { logoutUser } from "../controllers/users/logoutUser";
import { activateUser } from "../controllers/users/activateUser";
import { sendVerificationEmail } from "../controllers/users/sendVerificationEmail";
import {
  checkAuthentication,
  handleUnauthorizedLoginRequest,
} from "../utils/authUtils";
import { checkActivation } from "../controllers/users/checkActivation";
import { refreshToken } from "../controllers/users/refreshToken";
import { getUserInfo } from "../controllers/users/getUserInfo";


const userRoute = express.Router();

// -------------------------- //
// ----- GET Functions ------ //
// -------------------------- //

userRoute.get("/me", checkAuthentication, getUserInfo);

userRoute.get("/check-activation", checkAuthentication, checkActivation);
// -------------------------- //
// ----- POST Functions ----- //
// -------------------------- //

userRoute.post("/create", createUser);
userRoute.post("/login", handleUnauthorizedLoginRequest, loginUser);
userRoute.post("/logout", checkAuthentication, logoutUser);

// POST: extend the token of the user:
userRoute.post("/refresh-token", refreshToken);

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
