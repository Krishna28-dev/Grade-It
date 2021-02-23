import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import session from "express-session";

import dbConnection from "./utils/db.js";
import { config } from "../config/config";
import { errorHandler } from "./middleware/error";
import { authRouter } from "./routes/auth.js";

const app = express();
dbConnection();

config.environment == "dev" && app.use(morgan("dev"));

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

app.get("/", (req, res) => res.send("Hello world"));

app.use("/auth", authRouter);

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server is running at port 3000.\nGo to http://localhost:3000/");
});
