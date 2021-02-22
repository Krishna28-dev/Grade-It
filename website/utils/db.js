import mongoose from "mongoose";
import { mongoose as _mongoose, environment } from "../config/config.js";

const MONGO_HOSTNAME = _mongoose.MONGO_HOSTNAME;
const MONGO_PORT = _mongoose.MONGO_PORT;
const MONGO_DB = _mongoose.MONGO_DB;

const url = `mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`;

environment == "dev" && mongoose.set("debug", true); // To see mongoose data in the terminal Mongoose : ***
mongoose.Promise = Promise; // To use async functions

export default () => {
  mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(() => {
      console.log("Connected to the data base !!!");
    })
    .catch((err) => {
      console.log(`ERROR!!! : ${err}`);
    });
};
