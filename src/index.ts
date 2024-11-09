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
require("./middlewares/authStrategies/localStrategy");
require("./middlewares/authStrategies/jwtStrategy");
import websocketAuth from "./middlewares/websocketAuth"
import { addSocketConnection, getSocketByUserId, removeSocketConnection } from "./api/services/socket/socketConnections";
import { getOnlineFriendsSockets } from "./api/services/socket/retrieveOnlineFriends";
import { initializeSocket } from "./api/services/socket/socketHandler";

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
      "http://192.168.1.153:3000",
      "http://192.168.1.156:3000",
      "http://192.168.1.167:3000",
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
const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"],
    credentials: true
  }
});

initializeSocket(io);

useRoutes(app);
httpServer.listen(port, () => console.log(`Server is Running on Port ${port}...`));
export { db };
