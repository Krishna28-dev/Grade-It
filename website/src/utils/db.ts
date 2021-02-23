import mongoose from "mongoose";
import { config } from "../../config/config";

const MONGO_HOSTNAME = config.mongoose.hostName;
const MONGO_PORT = config.mongoose.portNumber;
const MONGO_DB = config.mongoose.databaseName;

const url = `mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`;

config.environment == "dev" && mongoose.set("debug", true); // To see mongoose data in the terminal Mongoose : ***
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
