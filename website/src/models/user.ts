import { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import { NextFunction } from "express";

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
  isStudent: {
    type: Boolean,
    default: true,
  },
});

UserSchema.pre("save", async function (this: IUser, next: NextFunction) {
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

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isStudent: boolean;
}
