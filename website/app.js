import express from "express";
import morgan from "morgan";

import dbConnection from "./utils/db.js";
import { environment } from "./config/config.js";

const app = express();

environment == "dev" && app.use(morgan("dev"));

app.get("/", (req, res) => res.send("Hello world"));

app.listen(3000, () => {
  console.log("Server is running at port 3000.\nGo to http://localhost:3000/");
});
