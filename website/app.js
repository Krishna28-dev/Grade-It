import express from "express";
import morgan from "morgan";

import dbConnection from "./utils/db.js";
import { environment } from "./config/config.js";
import { errorHandler } from "./middleware/error.js";

const app = express();
dbConnection();

environment == "dev" && app.use(morgan("dev"));

app.get("/", (req, res) => res.send("Hello world"));

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server is running at port 3000.\nGo to http://localhost:3000/");
});
