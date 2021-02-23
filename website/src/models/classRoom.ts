import { Schema, Document, model } from "mongoose";
import { ITest } from "./test";
import { IUser } from "./user";

const ClassroomSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
  applicants: [
    {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
  rejected: [
    {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  ],

  tests: [
    {
      type: Schema.Types.ObjectId,
      ref: "Tests",
    },
  ],
});

ClassroomSchema.methods.checkStudentStatus = function (
  this: IClassroom,
  userId: any
) {
  if (this.participants.includes(userId)) return "participant";
  if (this.applicants.includes(userId)) return "applicant";
  if (this.rejected.includes(userId)) return "rejected";
  return "";
};

export interface IClassroom extends Document {
  name: string;
  description: string;
  createdBy: IUser;
  participants: IUser[];
  applicants: IUser[];
  rejected: IUser[];

  tests: ITest[];
  // Assignments

  // methods
  checkStudentStatus(userId: any): string;
}

export const Classroom = model<IClassroom>("Classrooms", ClassroomSchema);
