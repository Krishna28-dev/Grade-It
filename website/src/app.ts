import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import session from "express-session";
import path from "path";

import dbConnection from "./utils/db.js";
import { config } from "../config/config";
import { errorHandler } from "./middleware/error";
import { authRouter } from "./routes/auth.js";

const app = express();
dbConnection();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ strict: false }));
app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 4 * 1000 * 60 * 60, // 4 hrs
    },
  })
);

app.use(express.static(path.join(__dirname, "../../public")));
app.set("views", path.join(__dirname, "../../views"));
app.set("view engine", "ejs");

config.environment == "dev" && app.use(morgan("dev"));

app.use("/auth", authRouter);

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server is running at port 3000.\nGo to http://localhost:3000/");
});
