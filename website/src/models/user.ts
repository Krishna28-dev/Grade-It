import { Schema, Document, model } from "mongoose";
import bcrypt from "bcrypt";
import { NextFunction } from "express";
import { IClassroom } from "./classRoom";
import { ITest } from "./test";
import { IResponse } from "./response";

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isStudent: {
    type: Boolean,
    default: true,
  },
  // classrooms created by faculty,
  // classrooms students are part of
  classRooms: [
    {
      classroomId: {
        type: Schema.Types.ObjectId,
        ref: "Classroom",
      },
      submissions: [
        {
          testId: {
            type: Schema.Types.ObjectId,
            ref: "Tests",
          },
          // AssignmentId : {
          //   type: Schema.Types.ObjectId,
          //   ref: "Assignments",
          // },
          ResponseId: {
            type: Schema.Types.ObjectId,
            ref: "Responses",
          },
        },
      ],
    },
  ],
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

UserSchema.methods.comparePassword = async function (
  this: IUser,
  inputPassword: string
): Promise<boolean> {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      const isMatch = await bcrypt.compare(inputPassword, this.password);
      resolve(isMatch);
    } catch (err) {
      // promise won't get rejected for password-mismatch,
      // only bcrypt error will cause promise reject
      reject(err);
    }
  });
};

export const User = model<IUser>("Users", UserSchema);

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isStudent: boolean;

  classRooms: {
    classroomId: IClassroom;
    submissions?: {
      testId: ITest;
      response: IResponse;
      // assignment
    }[];
  }[];

  // methods
  comparePassword(inputPassword: string): Promise<boolean>;
}
