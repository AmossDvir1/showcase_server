import passport = require("passport");
import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { connectToDB } from "./utils/DBConnection";
import { userRoute } from "./api/routes/users";
import { projectRoute } from "./api/routes/projects";
require("./middlewares/authStrategies/localStrategy");
require("./middlewares/authStrategies/jwtStrategy");

dotenv.config();
const port = process.env.PORT;
const app: Express = express();
if (!connectToDB()) {
  console.error("There was an error during Database connection");
}
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  })
);
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  next();
});
app.use(passport.initialize());

console.log(`Running on ${process.env.NODE_ENV ?? "development"} environment`);
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use("/user", userRoute);
app.use("/project", projectRoute);
app.listen(port, () => console.log(`Server is Running on Port ${port}...`));
