import { Schema } from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isExaminer: {
    type: Boolean,
    default: false,
  },
});

UserSchema.pre("save", async function (next) {
  try {
    // check if the password has been modified, if yes hash it.
    if (!this.isModified("password")) return next();

    // password has been changed, hashing it.
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    return next();
  } catch (err) {
    console.error("error while hashing the password, ", err);
    return next({ status: 500, message: err });
  }
});
