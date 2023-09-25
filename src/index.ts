import passport = require("passport");
import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { connectToDB } from "./utils/DBConnection";
import { useRoutes } from "./utils/utils";
import {Socket, Server} from "socket.io"
import { createServer } from "http";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
require("./middlewares/authStrategies/localStrategy");
require("./middlewares/authStrategies/jwtStrategy");

dotenv.config();
const port = process.env.PORT;
const app: Express = express();
const connect = async () => {
  return await connectToDB();
};
const db = connect();
if (!db) {
  console.error("There was an error during Database connection");
}

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://192.168.1.154:3000",
      "http://192.168.1.156:3000",
    ],
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

// Websocket connection: 
console.log("Initializing Websocket...");
const http = createServer(app);
export const io = new Server(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods:['GET','POST']
  }
});

// Maintain a mapping of user IDs to sockets
export const userSocketMap = new Map<string, Socket>();
// io.on("connection", (socket: Socket) => {
//   console.log(socket.id + " connected to Websocket")
//   socket.on("disconnect", () => {
//     console.log(socket.id + " disconnected");
//   });
// });


useRoutes(app);
app.listen(port, () => console.log(`Server is Running on Port ${port}...`));
export { db };
