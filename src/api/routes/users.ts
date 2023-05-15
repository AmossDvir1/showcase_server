import express from "express";
import { createUser } from "../controllers/users/createUser";
import passport from "passport";
import { loginUser } from "../controllers/users/loginUser";
const userRoute = express.Router();
// const passport = require("passport");

// -------------------------- //
// ----- GET Functions ------ //
// -------------------------- //

userRoute.get("/me", () => {
  console.log("hi");
});

// -------------------------- //
// ----- POST Functions ----- //
// -------------------------- //

userRoute.post("/create", createUser);
// userRoute.post("/login", loginUser);
userRoute.post("/login", passport.authenticate('local', {session: false}), loginUser);

// -------------------------- //
// ---- DELETE Functions ---- //
// -------------------------- //

// userRoute.delete("/delete", deleteUser);


export { userRoute };
