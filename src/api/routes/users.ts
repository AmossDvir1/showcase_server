import express from "express";
import { createUser } from "../controllers/users/createUser";
import passport from "passport";
import { loginUser } from "../controllers/users/loginUser";
import { activateUser } from "../controllers/users/activateUser";
import { sendVerificationEmail } from "../controllers/users/sendVerificationEmail";
import { checkAuthentication } from "../utils/authUtils";
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
// userRoute.post("/login", loginUser);
userRoute.post("/login", passport.authenticate('local', {session: false}), loginUser);

userRoute.post("/email_verification",checkAuthentication, sendVerificationEmail);


// -------------------------- //
// ----- PUT Functions ------ //
// -------------------------- //

userRoute.put("/activate_user",checkAuthentication, activateUser);


// -------------------------- //
// ---- DELETE Functions ---- //
// -------------------------- //

// userRoute.delete("/delete", deleteUser);


export { userRoute };
