import express from "express";
import morgan from "morgan";

import dbConnection from "./utils/db.js";
import { config } from "../config/config";
import { errorHandler } from "./middleware/error";

const app = express();
dbConnection();

config.environment == "dev" && app.use(morgan("dev"));

app.get("/", (req, res) => res.send("Hello world"));

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server is running at port 3000.\nGo to http://localhost:3000/");
});
