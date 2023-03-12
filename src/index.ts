const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
import { connectToDB } from "./utils/DBConnection";
import { PORT } from "./utils/constants";

const server = express();
connectToDB();
server.use(
    cors({
      origin: [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
      ],
    //   credentials: true, 
    })
  );
console.log(`Running on ${process.env.NODE_ENV ?? 'development'} environment`);
server.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

server.listen(PORT, () => console.log(`Server is Running on Port ${PORT}...`));
